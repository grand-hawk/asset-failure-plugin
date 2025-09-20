import Iris from '@rbxts/iris';

export default function Window() {
  const window = Iris.Window(['', true, true, true, true, true, false, true], {
    position: Vector2.zero,
  });

  const updateSize = () => window.state.size.set(window.Instance.AbsoluteSize);
  updateSize();
  // Position changes on resize, so safe to not add a AbsoluteSize listener
  window.Instance.GetPropertyChangedSignal('AbsolutePosition').Connect(
    updateSize,
  );

  return window;
}
