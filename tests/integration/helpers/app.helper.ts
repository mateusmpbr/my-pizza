import 'reflect-metadata';
import { createApp } from '../../../src/app';
import { Application } from 'express';

let app: Application | null = null;

export function getTestApp(): Application {
  if (!app) {
    app = createApp();
  }
  return app;
}
