const Track = require('../models/track')
const successHandler = require('../service/handleSuccess')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const { map } = require('../server')

const track = {
  getTrackList: handleErrorAsync(async (req, res) => {
    let msg = '200'
    const tracks = await Track.find({
      user: req.user.id
    })
      .populate({
        path: 'tracking',
        select: 'name photo'
      })
    if (tracks.length === 0) msg = '目前無追蹤者'

    // 重組 tracker 回傳
    const tracking = []
    tracks.map((ele) => {
      const { _id, name, photo } = ele.tracking
      const tracker = {
        _id,
        name,
        photo,
        createdAt: ele.createdAt
      }
      tracking.push(tracker)
    })

    const result = {
      user: req.user.id,
      tracking
    }
    successHandler(res, msg, result)
  }),

  addTrack: handleErrorAsync(async (req, res, next) => {
    const { trackId } = req.params
    if (trackId === req.user.id) {
      return next(appError(401, '您無法追蹤自己', next))
    }

    // 確認無重複追蹤
    const checkTracker = await Track.find({
      user: req.user.id,
      tracking: trackId
    }).populate({
      path: 'user',
      select: 'name'
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

    if (!deleteTracker || deleteTracker.length == 0) return next(appError(401, '追蹤列表無該用戶，無法刪除', next))

    return successHandler(res, '取消追蹤成功', deleteTracker)
  })

  //   checkTrackerStatus: handleErrorAsync(async (req, res, next) => {

//   })
}

module.exports = track
