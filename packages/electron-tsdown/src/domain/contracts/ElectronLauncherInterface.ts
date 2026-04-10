export interface ElectronLauncherInterface {
  launch(entryFile: string, args: string[]): Promise<void>
  restart(entryFile: string, args: string[]): Promise<void>
  kill(): Promise<void>
}
