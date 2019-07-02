import * as fs from 'promise-fs';
import { parse } from 'path';
import { Router, Request, Response, NextFunction } from 'express';

import * as file from '../utils/file'
import { Type, ServerResponse } from '../models';
import { createError } from '../utils'

export default async function (path: string, req: Request, res: Response, next: NextFunction) {
  const parsed = parse(path);
  const stat: fs.Stats = await fs.stat(path);
  
  let type;
  let payload;
  
  if (await stat.isDirectory()) {
    type = Type.folder;
    payload = await file.getFileList(stat, path);
  } else {
    type = file.getType(parsed.ext);
    
    switch(type) {
      case Type.video:
        payload = await file.getVideo(stat, path);
        break;
      case Type.text:
        payload = await file.getText(stat, path);
        break;
      case Type.image:
        payload = await file.getImage(stat, path);
        break;
      default:
        next(createError(400, 'Cannot open this file'));
    }
  }
    
  const response: ServerResponse = {
    type: type,
    path: path,
    name: parsed.name,
    ext: parsed.ext,
    payload: payload
  }
  
  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify(response, null, 4));
}