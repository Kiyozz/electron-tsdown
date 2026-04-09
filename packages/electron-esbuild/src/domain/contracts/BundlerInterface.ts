export interface BundlerInterface {
  readonly target: 'main' | 'renderer'
  build(): Promise<void>
  /** Watch for changes, calling onRebuild after each successful rebuild. */
  dev(onRebuild: () => Promise<void>): Promise<void>
}
