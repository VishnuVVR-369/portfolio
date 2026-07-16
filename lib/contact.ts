// Shared contact-form vocabulary. Lives outside lib/server so both the
// client form (labels) and the server schema (allowed values) can import it
// without pulling `server-only` into the client bundle.

export const ROLE_TYPES = [
  { value: "full-time", label: "full-time role" },
  { value: "contract", label: "contract / consulting" },
  { value: "advisory", label: "advisory / fractional" },
  { value: "collab", label: "collaboration / project" },
  { value: "saying-hi", label: "just saying hi" },
] as const;

export type RoleTypeValue = (typeof ROLE_TYPES)[number]["value"];

export const ROLE_TYPE_VALUES = ROLE_TYPES.map((r) => r.value) as [
  RoleTypeValue,
  ...RoleTypeValue[],
];

const ROLE_LABEL_BY_VALUE = new Map(ROLE_TYPES.map((r) => [r.value, r.label]));

export function roleTypeLabel(value: string): string {
  return ROLE_LABEL_BY_VALUE.get(value as RoleTypeValue) ?? value;
}
