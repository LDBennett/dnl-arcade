// Visible only on desktop (CSS `hover: hover` + `pointer: fine`, see globals.css)
// since touch devices have no keyboard to hint at.
export function KeyboardHint() {
  return (
    <p className="engine-keyboard-hint text-xs text-arcade-purple">
      &uarr;&darr;&larr;&rarr; or WASD to move &middot; Enter to select &middot; Esc to go back
    </p>
  );
}
