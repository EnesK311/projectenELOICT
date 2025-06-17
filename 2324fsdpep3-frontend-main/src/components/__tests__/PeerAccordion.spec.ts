// PeerAccordion.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PeerAccordion from '../molecules/PeerAccordion.vue'
import PeerAccordionIcon from '@/components/atoms/PeerAccordionIcon.vue'

describe('PeerAccordion.vue', () => {
  it('renders the accordion component', () => {
    const wrapper = mount(PeerAccordion, {
      props: {
        initiallyOpen: false
      },
      slots: {
        header: '<div>Accordion Header</div>',
        content: '<div>Accordion Content</div>'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.accordion-header').text()).toContain('Accordion Header')
    expect(wrapper.findComponent(PeerAccordionIcon).exists()).toBe(true)
  })

  it('is initially closed when initiallyOpen is false', () => {
    const wrapper = mount(PeerAccordion, {
      props: {
        initiallyOpen: false
      },
      slots: {
        content: '<div>Accordion Content</div>'
      }
    })

    expect(wrapper.find('.accordion-content').exists()).toBe(false)
  })

  it('is initially open when initiallyOpen is true', () => {
    const wrapper = mount(PeerAccordion, {
      props: {
        initiallyOpen: true
      },
      slots: {
        content: '<div>Accordion Content</div>'
      }
    })

    expect(wrapper.find('.accordion-content').exists()).toBe(true)
  })

  it('toggles content visibility when the header is clicked', async () => {
    const wrapper = mount(PeerAccordion, {
      props: {
        initiallyOpen: false
      },
      slots: {
        header: '<div>Accordion Header</div>',
        content: '<div>Accordion Content</div>'
      }
    })

    const header = wrapper.find('.accordion-header')
    expect(wrapper.find('.accordion-content').exists()).toBe(false)

    // Click to open the accordion
    await header.trigger('click')
    expect(wrapper.find('.accordion-content').exists()).toBe(true)

    // Click to close the accordion
    await header.trigger('click')
    expect(wrapper.find('.accordion-content').exists()).toBe(false)
  })
})
