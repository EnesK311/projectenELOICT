// PeerAssessmentList.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PeerAssessmentList from '@/components/organisms/PeerAssessmentList.vue'
import PeerAssessment from '@/components/molecules/PeerAssessment.vue'
import { createTestingPinia } from '@pinia/testing'
import { useAssesmentStore } from '@/stores/assessment'

describe('PeerAssessmentList.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(PeerAssessmentList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
  })

  it('renders "no assessments" message when there are no assessments', () => {
    const assessmentStore = useAssesmentStore()
    assessmentStore.assessments = []

    wrapper.vm.$forceUpdate() // Ensure reactivity is triggered

    expect(wrapper.find('.no-assessments-message').text()).toBe(
      "Lucky you! You don't have any assessments yet."
    )
    expect(wrapper.findComponent(PeerAssessment).exists()).toBe(false)
  })

  it('renders a list of assessments when data is available', async () => {
    const assessmentStore = useAssesmentStore()
    assessmentStore.assessments = [
      {
        id: 1,
        title: 'Assessment 1',
        description: 'Description 1',
        teacher: { id: 1, name: 'Teacher 1' },
        opo: { id: 1, name: 'OPO 1' },
        end_date: '2024-08-01',
        is_result_visible: 1,
        state: 'green',
        created_at: '2024-01-01',
        updated_at: '2024-02-01'
      },
      {
        id: 2,
        title: 'Assessment 2',
        description: 'Description 2',
        teacher: { id: 2, name: 'Teacher 2' },
        opo: { id: 2, name: 'OPO 2' },
        end_date: '2024-08-02',
        is_result_visible: 0,
        state: 'orange',
        created_at: '2024-01-02',
        updated_at: '2024-02-02'
      }
    ]

    wrapper.vm.$forceUpdate() // Ensure reactivity is triggered

    const assessments = wrapper.findAllComponents(PeerAssessment)
    expect(assessments.length).toBe(2)
    expect(wrapper.find('.no-assessments-message').exists()).toBe(false)
  })

  it('renders the correct data for each PeerAssessment component', () => {
    const assessmentStore = useAssesmentStore()
    assessmentStore.assessments = [
      {
        id: 1,
        title: 'Assessment 1',
        description: 'Description 1',
        teacher: { id: 1, name: 'Teacher 1' },
        opo: { id: 1, name: 'OPO 1' },
        end_date: '2024-08-01',
        is_result_visible: 1,
        state: 'green',
        created_at: '2024-01-01',
        updated_at: '2024-02-01'
      },
      {
        id: 2,
        title: 'Assessment 2',
        description: 'Description 2',
        teacher: { id: 2, name: 'Teacher 2' },
        opo: { id: 2, name: 'OPO 2' },
        end_date: '2024-08-02',
        is_result_visible: 0,
        state: 'orange',
        created_at: '2024-01-02',
        updated_at: '2024-02-02'
      }
    ]

    wrapper.vm.$forceUpdate() // Ensure reactivity is triggered

    const assessments = wrapper.findAllComponents(PeerAssessment)
    expect(assessments[0].props('assessment').title).toBe('Assessment 1')
    expect(assessments[1].props('assessment').title).toBe('Assessment 2')
  })
})
