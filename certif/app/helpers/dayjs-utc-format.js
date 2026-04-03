import { helper } from '@ember/component/helper';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export function dayjsUtcFormat([value, format], { inputFormat, allowEmpty }) {
  if (!value) return allowEmpty ? '' : null;
  const parsed = inputFormat ? dayjs.utc(value, inputFormat) : dayjs.utc(value);
  if (!parsed.isValid()) return allowEmpty ? '' : null;
  return parsed.format(format);
}

export default helper(dayjsUtcFormat);
