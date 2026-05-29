import { Radio, Select, Badge, Text, Stack } from '@mantine/core';
import { STRINGS } from '../strings';
import type { Option } from '../../../types';

export interface OptionFieldProps {
  option: Option;
  value: string | undefined;
  onChange: (value: string | null) => void;
}

export default function OptionField({ option, value, onChange }: OptionFieldProps) {
  const { strategy, required } = option;
  const label = (
    <Text fw={500}>
      {strategy.label}
      {required && (
        <Text span c="red" ml={2}>
          *
        </Text>
      )}
    </Text>
  );

  const valueLabels = strategy.valueLabels ?? {};

  if (strategy.control === 'readonly') {
    const displayValue = valueLabels[option.values[0]] ?? option.values[0];
    return (
      <Stack gap={4}>
        {label}
        <Badge variant="outline" color="gray">
          {displayValue}
        </Badge>
        <Text size="xs" c="dimmed">
          {STRINGS.options.readonlyDisclaimer}
        </Text>
      </Stack>
    );
  }

  if (strategy.control === 'select') {
    return (
      <Select
        label={label}
        value={value ?? null}
        onChange={onChange}
        placeholder={STRINGS.options.selectPlaceholder}
        data={option.values.map((v) => ({ value: v, label: valueLabels[v] ?? v }))}
        clearable={!required}
        autoFocus
      />
    );
  }

  return (
    <Radio.Group label={label} value={value ?? ''} onChange={onChange}>
      <Stack gap="xs" mt="xs">
        {option.values.map((v) => (
          <Radio
            key={v}
            value={v}
            label={valueLabels[v] ?? v}
            styles={{ input: { cursor: 'pointer' }, label: { cursor: 'pointer' } }}
          />
        ))}
      </Stack>
    </Radio.Group>
  );
}
