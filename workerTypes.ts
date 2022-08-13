interface AbstractWorkerEvent {
  type: string
}

export interface InitWorkerEvent extends AbstractWorkerEvent {
  type: "init"
  d: [number, number]
}

export interface ScanWorkerEvent extends AbstractWorkerEvent {
  type: "scan"
  data: ImageData
}

export type WorkerEvent = InitWorkerEvent | ScanWorkerEvent
