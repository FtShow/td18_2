export type Action<T extends (...arg: any)=> any> = Omit<ReturnType<T>, 'meta'>

export type BaseResponse<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
};