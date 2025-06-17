import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import DoubleRange from '../atoms/DoubleRange.vue'; // Update the path

describe('DoubleRange.vue', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(DoubleRange, {
      props: {
        min: 0,
        max: 100,
        steps: 10,
        unit: 'kg',
        id: 'test-range',
      },
    });

    // Check min and max initial values
    expect((wrapper.find("input[type='range'][id='test-range-min']").element as HTMLInputElement).value).toBe('0');
    expect((wrapper.find("input[type='range'][id='test-range-max']").element as HTMLInputElement).value).toBe('100');

    // Check text input displays
    expect((wrapper.find("input[type='text'][id='test-range-min']").element as HTMLInputElement).value).toBe('0kg');
    expect((wrapper.find("input[type='text'][id='test-range-max']").element as HTMLInputElement).value).toBe('100kg');
  });


  it('emits updated model values on change', async () => {
    const emitSpy = vi.fn();
    const wrapper = mount(DoubleRange, {
      props: {
        min: 0,
        max: 100,
        steps: 10,
        id: 'test-range',
        'onUpdate:modelValue': emitSpy,
      },
    });

    const minInput = wrapper.find("input[type='text'][id='test-range-min']");

    // Simulate updating the minimum value
    await minInput.setValue('30kg');
    await minInput.trigger('change');

    expect(emitSpy).toHaveBeenCalledWith({ min: 30, max: 100 });
  });


});
