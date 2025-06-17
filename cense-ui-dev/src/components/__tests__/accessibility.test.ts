import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import AccessibilityView from '@/views/AccessibilityView.vue';
import AccessibilityStatement from '@/components/atoms/AccessibilityStatement.vue';


describe('AccessibilityView.vue', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(AccessibilityView);
  });

  it('renders the AccessibilityStatement component within a main tag', () => {
    const main = wrapper.find('main');
    expect(main.exists()).toBe(true);

    const accessibilityStatement = main.findComponent(AccessibilityStatement);
    expect(accessibilityStatement.exists()).toBe(true);
  });

  it('displays the correct heading and introduction text', () => {
    expect(wrapper.text()).toContain('Toegankelijkheidsverklaring');
    expect(wrapper.text()).toContain(
      'Cense, verbindt zich ertoe deze site toegankelijk te maken, in overeenstemming met de volgende wetgeving: Wet van 19 juli 2018 betreffende de toegankelijkheid van websites en mobiele applicaties van overheidsorganisaties.'
    );
  });

  it('contains the correct website link', () => {
    const link = wrapper.find('a[href="https://fconnect.brentbauwens.ikdoeict.be"]');
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe('https://fconnect.brentbauwens.ikdoeict.be');
  });

  it('renders all sections with proper headings', () => {
    const headings = wrapper.findAll('h2');
    const headingTexts = headings.map((h) => h.text());
    expect(headingTexts).toEqual([
      'Nalevingsstatus',
      'Uw verklaring voorbereiden',
      'Contactgegevens',
      'Verbeteringsplan',
    ]);
  });

  it('includes contact information', () => {
    expect(wrapper.text()).toContain('thomas.hendrikx@odisee.be');
    expect(wrapper.text()).toContain('Cense, Odisee');
  });

  it('mentions the improvement plan', () => {
    expect(wrapper.text()).toContain('Voldoen aan WCAG 2.2');
  });

  it('displays the creation and revision dates', () => {
    expect(wrapper.text()).toContain('Deze verklaring is op 05/11/2024 opgesteld.');
    expect(wrapper.text()).toContain('De laatste herziening van de verklaring vond plaats op 05/11/2024');
  });

  it('has the correct styling', () => {
    const container = wrapper.find('.container');
    expect(container.exists()).toBe(true);
    const styles = getComputedStyle(container.element);
    expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });
});
