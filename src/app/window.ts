import Iris from '@rbxts/iris';

export default function Window() {
  const window = Iris.Window(['', true, true, true, true, true, false, true], {
    position: Vector2.zero,
  });

  function updateSize() {
    window.state.size.set(window.Instance.AbsoluteSize);
  }

  updateSize();

  window.Instance.GetPropertyChangedSignal('AbsolutePosition').Connect(() =>
    updateSize(),
  );

  return window;
}
