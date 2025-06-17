import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import BackButton from "../atoms/BackButton.vue";

const mockBack = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe("BackButton", () => {
  it("should go back when clicked", async () => {
    const wrapper = mount(BackButton);

    expect(wrapper.exists()).toBe(true);

    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);

    await button.trigger('click');

    expect(mockBack).toHaveBeenCalled();
  });
});
