import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="22"
      {...props}
    />
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M15 18l-6-6 6-6" />
      <path d="M9 12h10" />
    </BaseIcon>
  );
}

export function BulletListIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="6" cy="7" r="1.25" />
      <circle cx="6" cy="12" r="1.25" />
      <circle cx="6" cy="17" r="1.25" />
      <path d="M10 7h8" />
      <path d="M10 12h8" />
      <path d="M10 17h8" />
    </BaseIcon>
  );
}

export function ChecklistIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M10 7h8" />
      <path d="M10 12h8" />
      <path d="M10 17h8" />
      <path d="M4.5 7.2l1.4 1.4 2.1-2.3" />
      <path d="M4.5 12.2l1.4 1.4 2.1-2.3" />
      <path d="M4.5 17.2l1.4 1.4 2.1-2.3" />
    </BaseIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12.5l4 4L19 7.5" />
    </BaseIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6l-12 12" />
    </BaseIcon>
  );
}

export function DotsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="5.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18.5" r="1.1" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 20l4.5-1 9.2-9.2a2 2 0 00-2.8-2.8L5.7 16.2 4 20z" />
      <path d="M13.5 6.5l4 4" />
    </BaseIcon>
  );
}

export function FontSizeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 18l3.2-9h.2l3.2 9" />
      <path d="M7.1 15h4.4" />
      <path d="M15 9h5" />
      <path d="M17.5 7v10" />
    </BaseIcon>
  );
}

export function FontSizeDownIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 18l2.8-8h.2l2.8 8" />
      <path d="M6.9 15h3.8" />
      <path d="M15 12h5" />
    </BaseIcon>
  );
}

export function FontSizeUpIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 18l2.8-8h.2l2.8 8" />
      <path d="M6.9 15h3.8" />
      <path d="M17.5 9v6" />
      <path d="M14.5 12h6" />
    </BaseIcon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 12h17" />
      <path d="M12 3c2.7 2.4 4.2 5.6 4.2 9S14.7 18.6 12 21" />
      <path d="M12 3c-2.7 2.4-4.2 5.6-4.2 9S9.3 18.6 12 21" />
    </BaseIcon>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M19 14.5A7.5 7.5 0 019.5 5a8 8 0 109.5 9.5z" />
    </BaseIcon>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 4h6" />
      <path d="M10 4v5l-3 3h10l-3-3V4" />
      <path d="M12 12v8" />
    </BaseIcon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </BaseIcon>
  );
}

export function TuneIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 6h14" />
      <path d="M5 12h14" />
      <path d="M5 18h14" />
      <circle cx="9" cy="6" r="1.8" />
      <circle cx="15" cy="12" r="1.8" />
      <circle cx="11" cy="18" r="1.8" />
    </BaseIcon>
  );
}

export function SharedIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="8" cy="9" r="2.5" />
      <circle cx="16.5" cy="8" r="2" />
      <path d="M4.5 18.5c1.2-2.6 3.1-4 5.8-4s4.7 1.4 5.8 4" />
      <path d="M14.3 14c.7-.8 1.6-1.2 2.9-1.2 1.4 0 2.6.5 3.3 1.7" />
    </BaseIcon>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="18" cy="5" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="M8 11l8-5" />
      <path d="M8 13l8 5" />
    </BaseIcon>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1 1 0 00.2 1.1l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1 1 0 00-1.1-.2 1 1 0 00-.6.9V20a2 2 0 01-4 0v-.1a1 1 0 00-.6-.9 1 1 0 00-1.1.2l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1 1 0 00.2-1.1 1 1 0 00-.9-.6H4a2 2 0 010-4h.1a1 1 0 00.9-.6 1 1 0 00-.2-1.1l-.1-.1a2 2 0 012.8-2.8l.1.1a1 1 0 001.1.2 1 1 0 00.6-.9V4a2 2 0 014 0v.1a1 1 0 00.6.9 1 1 0 001.1-.2l.1-.1a2 2 0 012.8 2.8l-.1.1a1 1 0 00-.2 1.1 1 1 0 00.9.6H20a2 2 0 010 4h-.1a1 1 0 00-.9.6z" />
    </BaseIcon>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5" />
      <path d="M12 19v2.5" />
      <path d="M4.9 4.9l1.8 1.8" />
      <path d="M17.3 17.3l1.8 1.8" />
      <path d="M2.5 12H5" />
      <path d="M19 12h2.5" />
      <path d="M4.9 19.1l1.8-1.8" />
      <path d="M17.3 6.7l1.8-1.8" />
    </BaseIcon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7l1 13h8l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </BaseIcon>
  );
}

export function UnderlineIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 5v5a5 5 0 0010 0V5" />
      <path d="M5 19h14" />
    </BaseIcon>
  );
}
