import Iris from '@rbxts/iris';

import Window from './window';
import indexDataModel from 'lib/indexDataModel';
import { Selection } from 'services';

export default function App() {
  const outputInstancesState = Iris.State<Instance[]>([]);
  const outputIterationCount = Iris.State<number>(0);
  const indexThread = Iris.State<thread | undefined>(undefined);

  function cancel() {
    const thread = indexThread.get()!;
    if (thread) {
      task.cancel(thread);
      indexThread.set(undefined);
    }
  }

  Window();

  Iris.SeparatorText(['Control']);

  if (!indexThread.get()) {
    const startButton = Iris.Button(['Start']);
    if (startButton.clicked()) {
      const thread = indexDataModel(
        outputInstancesState,
        outputIterationCount,
        () => indexThread.set(undefined),
      );
      indexThread.set(thread);

      outputInstancesState.set([]);
      outputIterationCount.set(0);
    }
  }

  if (indexThread.get()) {
    const stopButton = Iris.Button(['Stop']);
    if (stopButton.clicked()) cancel();
  }

  const resetButton = Iris.Button(['Reset']);
  if (resetButton.clicked()) {
    outputInstancesState.set([]);
    outputIterationCount.set(0);
  }

  Iris.Text([`Indexed: ${outputIterationCount.get()} instances (±100)`]);
  Iris.Text([`Failure: ${outputInstancesState.get().size()} instances`]);

  Iris.SeparatorText(['Output']);

  for (const instance of outputInstancesState.get()) {
    if (!instance) continue;

    const fullNameSegments = instance.GetFullName().split('.');
    fullNameSegments.shift();

    const button = Iris.Button([
      `${fullNameSegments.join('.')} (${instance.ClassName})`,
    ]);
    if (button.clicked()) Selection.Set([instance] as unknown as Instances);
  }

  Iris.End();
}
