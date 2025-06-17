import { mount, RouterLinkStub } from '@vue/test-utils';
import FFooter from '../molucules/FFooter.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FFooter.vue', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: { template: '<div>Home</div>' },
        meta: { showInFooter: true },
      },
      {
        path: '/accessibility',
        name: 'accessibility',
        component: { template: '<div>Accessibility</div>' },
        meta: { showInFooter: true },
      },
      {
        path: '/login',
        name: 'login',
        component: { template: '<div>Login</div>' },
        meta: { showInFooter: false },
      },
    ],
  });

  let wrapper: ReturnType<typeof mount>;

  beforeEach(async () => {
    wrapper = mount(FFooter, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    await router.isReady();
  });

  it('renders the footer with correct structure', () => {
    expect(wrapper.find('footer').exists()).toBe(true);
    expect(wrapper.find('.container').exists()).toBe(true);
    expect(wrapper.find('.links').exists()).toBe(true);
  });

  it('renders the correct images', () => {
    const containerImages = wrapper.findAll('.container img');
    expect(containerImages.at(0)?.attributes('src')).toContain(
      'Logo_Vlaanderen_Departement_Onderwijs.png',
    );
    expect(containerImages.at(0)?.attributes('alt')).toBe(
      'Logo Vlaams departement van onderwijs',
    );
    expect(containerImages.at(1)?.attributes('src')).toContain(
      'Odisee_Logo_Co-hogeschool.png',
    );
    expect(containerImages.at(1)?.attributes('alt')).toBe('Logo Odisee Co-hogeschool');
  });

  it('renders the correct links from allRoutes', () => {
    const footerLinks = wrapper.findAll('.sub-nav ul:first-of-type li');
    expect(footerLinks.length).toBe(2); // Only routes with `showInFooter: true`

    expect(footerLinks.at(0)?.text()).toBe('home');
    expect(footerLinks.at(0)?.findComponent(RouterLinkStub).props('to')).toBe('/');
    expect(footerLinks.at(1)?.text()).toBe('accessibility');
    expect(footerLinks.at(1)?.findComponent(RouterLinkStub).props('to')).toBe(
      '/accessibility',
    );
  });

  it('renders additional links correctly', () => {
    const additionalLinks = wrapper.findAll('.sub-nav ul:last-of-type li a');
    expect(additionalLinks.at(0)?.attributes('href')).toBe(
      'https://www.freeprivacypolicy.com/live/56f1ebd1-081c-400b-84cf-180496813341',
    );
    expect(additionalLinks.at(0)?.text()).toBe('Privacy Policy');

    const accessibilityLink = wrapper
      .findAll('.sub-nav ul:last-of-type li')
      .at(1)
      ?.findComponent(RouterLinkStub);
    expect(accessibilityLink?.props('to')).toBe('/accessibility');
    expect(accessibilityLink?.text()).toBe('Accessibility Statement');

    const censeLink = wrapper
      .findAll('.sub-nav ul:last-of-type li')
      .at(2)
      ?.findComponent(RouterLinkStub);
    expect(censeLink?.props('to')).toBe('/');
    expect(censeLink?.text()).toBe('© 2024 with Cense');
  });

});
