import { Conversation } from '../models';

export * from '../models';
export { Actions, Effect, ofType } from '@ngrx/effects';
export { select, Store, Action } from '@ngrx/store';

export enum AppFields {
  App = 'app',
  Conversations = 'conversations'
}

export interface AppState {
    [AppFields.Conversations]: Conversation[];
}

export const InitialState: AppState = {
  [AppFields.Conversations]: null
};

export enum AppTypes {
  UpdateState = 'update-app-state'
}

export interface UpdateState {
  type: AppTypes.UpdateState;
  payload: any;
}

export type AppAction = UpdateState;
