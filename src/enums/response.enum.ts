export enum EarnipayResponseStatus {
  SUCCESS = '00',
  FAILED = '99',
  PENDING = '03',
  NOT_FOUND = '04',
  WARNING = '95',
}

export enum EarnipayResponseMessage {
  SUCCESS = 'Operation Successful',
  FAILED = 'Operation Failed',
  PENDING = 'Operation in progress',
}
