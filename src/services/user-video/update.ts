import * as Joi from '@hapi/joi';

import { ServiceResult, RequestService } from '@src/services';
import { Auth } from '@src/models';
import { Video, UserVideo } from '@src/entity';

const schema = Joi.object({
  token: Joi.string().required(),
  videoId: Joi.number().required(),
  time: Joi.number().required(),
});

export default async function (body: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(body);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { token, videoId, time } = value as any;

  if (time === 0) {
    return [204, {}];
  }

  const auth: Auth = await RequestService.validateToken(token);
  const userId = auth.id;

  const video = await Video.findOne({ id: videoId });
  const userVideo: UserVideo | null = await UserVideo.findOne({ userId, video });

  if (!userVideo) {
    await UserVideo.insert({ userId, video });
  } else {
    await UserVideo.update({ userId, video }, { time, date: new Date() });
  }

  return [204, {}];
}
