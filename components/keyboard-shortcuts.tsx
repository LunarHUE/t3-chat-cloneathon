import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type KeyboardShortcut = {
  name: string;
  shortcut: string[];
};

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
}

export default function KeyboardShortcuts({
  shortcuts,
}: KeyboardShortcutsProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {shortcuts.map((shortcut) => (
          <KeyboardShortcut key={shortcut.name} shortcut={shortcut} />
        ))}
      </CardContent>
    </Card>
  );
}

function KeyboardShortcut({ shortcut }: { shortcut: KeyboardShortcut }) {
  return (
    <div className="flex justify-between">
      <span>{shortcut.name}</span>
      <div className="flex gap-2">
        {shortcut.shortcut.map((key) => (
          <span
            key={key}
            className="p-1 px-1.5 bg-muted rounded-md text-sm font-semibold"
          >
            {key}
          </span>
        ))}
      </div>
    </div>
  );
}
