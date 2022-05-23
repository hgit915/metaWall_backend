const Track = require('../models/track')
const User = require('../models/user')
const successHandler = require('../service/handleSuccess')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const { map } = require('../server')

const track = {
  getTrackList: handleErrorAsync(async (req, res) => {
    const tracks = await Track.find({
      user: req.user.id
    })
      .populate({
        path: 'tracking',
        select: 'name photo'
      })

    if (tracks.length === 0) { return successHandler(res, '目前無追蹤者', []) }
    // 重組 tracker 回傳
    const tracking = tracks.map((ele) => {
      const { _id, name, photo } = ele.tracking
      const tracker = {
        _id,
        name,
        photo,
        createdAt: ele.createdAt
      }
      return tracker
    })
    const result = {
      user: req.user.id,
      tracking
    }
    successHandler(res, '200', result)
  }),

  addTrack: handleErrorAsync(async (req, res, next) => {
    const { trackId } = req.params
    if (trackId === req.user.id) {
      return next(appError(401, '您無法追蹤自己', next))
    }
    // 被追蹤者是否為 metaWall 的使用者
    const checkUser = await User.findById(trackId)
    if (!checkUser) return next(appError(401, 'metaWall 的世界沒有這個用戶', next))

    // 確認無重複追蹤
    const checkTracker = await Track.find({
      user: req.user.id,
      tracking: trackId
    })
    if (checkTracker.length > 0) return next(appError(401, '您已追蹤該用戶', next))

    const result = await Track.create({
      user: req.user.id,
      tracking: trackId
    })

    return successHandler(res, '追蹤成功', result)
  }),

  deleteTrack: handleErrorAsync(async (req, res, next) => {
    const { trackId } = req.params
    if (trackId === req.user.id) {
      return next(appError(401, '您無法取消追蹤自己', next))
    }

    const deleteTracker = await Track.findOneAndDelete({
      user: req.user.id,
      tracking: trackId
    })

    if (!deleteTracker || deleteTracker.length === 0) return next(appError(401, '追蹤列表無該用戶，無法刪除', next))

    return successHandler(res, '取消追蹤成功', deleteTracker)
  })

}

module.exports = track
