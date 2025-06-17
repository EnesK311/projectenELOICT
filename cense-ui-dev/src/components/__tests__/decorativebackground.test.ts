import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import DecorativeBackground from '@/components/atoms/DecorativeBackground.vue'; // Replace with actual component path

describe('DecorativeBackground Component', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock `addEventListener` and `removeEventListener`
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders shapes correctly on mount', async () => {
    const wrapper = mount(DecorativeBackground);

    // Trigger nextTick to allow reactivity to apply changes
    await nextTick();

    // Check if shapes are generated
    const shapes = wrapper.findAll('.shape');
    expect(shapes.length).toBeGreaterThan(0);

    // Check if shapes have correct styles
    const firstShape = shapes[0];
    expect(firstShape.attributes('style')).toContain('left');
    expect(firstShape.attributes('style')).toContain('top');
    expect(firstShape.attributes('style')).toContain('width');
    expect(firstShape.attributes('style')).toContain('height');
    expect(firstShape.attributes('style')).toContain('border-radius');
    expect(firstShape.attributes('style')).toContain('rotate');
  });

  it('registers resize event listener on mount', () => {
    mount(DecorativeBackground);
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('removes resize event listener on unmount', () => {
    const wrapper = mount(DecorativeBackground);
    wrapper.unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('updates shapes on window resize', async () => {
    const wrapper = mount(DecorativeBackground);

    // Mock window resize
    window.innerWidth = 500;
    window.innerHeight = 500;
    window.dispatchEvent(new Event('resize'));

    // Wait for reactivity to update shapes
    await nextTick();

    const shapesAfterResize = wrapper.findAll('.shape');
    expect(shapesAfterResize.length).toBeGreaterThan(0);
  });
});
