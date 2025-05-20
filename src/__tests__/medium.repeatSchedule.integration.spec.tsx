import { ChakraProvider } from '@chakra-ui/react';
import { act, render, renderHook, screen } from '@testing-library/react';

import { setupMockHandlerEventListCreation } from '../__mocks__/handlersUtils';
import EventItem from '../components/EventItem';
import { useEventOperations } from '../hooks/useEventOperations';
import { Event, RepeatInfo } from '../types';
import {
  generateDailyRepeats,
  generateMonthlyRepeats,
  generateRepeats,
  generateWeeklyRepeats,
  generateYearlyRepeats,
} from '../utils/repeatUtils';

describe('반복 유형 선택 - 통합테스트', () => {
  it('2월 29일에 시작하는 연간 반복 일정은 윤년에만 생성되어 저장된다.', async () => {
    setupMockHandlerEventListCreation();

    const { result } = renderHook(() => useEventOperations(false, true));

    await act(() => Promise.resolve(null));

    const startDate = new Date('2024-02-29');
    const endDate = new Date('2032-12-31');

    const baseEvent = {
      id: '',
      title: '윤년 테스트',
      startTime: '10:00',
      endTime: '11:00',
      description: '',
      location: '',
      category: '기타',
      repeat: { type: 'yearly', interval: 1, endDate: '2032-12-31' },
      notificationTime: 10,
    } as Omit<Event, 'date' | 'id'>;

    const events = generateYearlyRepeats(startDate, endDate).map((date) => ({
      ...baseEvent,
      id: '',
      date: date.toISOString().slice(0, 10),
    }));

    for (const event of events) {
      await act(async () => {
        await result.current.saveEvent(event);
      });
    }

    const savedDates = result.current.events.map((e) => e.date);

    expect(savedDates).toEqual(['2024-02-29', '2028-02-29', '2032-02-29']);
  });

  it('매월 31일로 설정한 반복 일정은 31일이 있는 달에만 생성된다.', async () => {
    setupMockHandlerEventListCreation();
    const { result } = renderHook(() => useEventOperations(false, true));

    await act(() => Promise.resolve(null));

    const startDate = new Date('2025-1-31');
    const endDate = new Date('2025-06-30');

    const baseEvent = {
      id: '',
      title: '매월 31일 일정',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '정기',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-06-30' },
      notificationTime: 10,
    } as Omit<Event, 'id' | 'date'>;

    // 31일이 존재하는 달만 반복 이벤트 생성
    const events = generateMonthlyRepeats(startDate, endDate, 1).map((date) => ({
      ...baseEvent,
      id: '',
      date: date.toISOString().slice(0, 10),
    }));

    for (const event of events) {
      await act(async () => {
        await result.current.saveEvent(event);
      });
    }
    const savedDates = result.current.events.map((e) => e.date);

    expect(savedDates).toEqual(['2025-01-31', '2025-03-31', '2025-05-31']);
  });
});

describe('반복 간격 설정', () => {
  it('2일마다 반복 일정이 저장되고, 올바른 간격으로 생성된다.', async () => {
    setupMockHandlerEventListCreation();
    const { result } = renderHook(() => useEventOperations(false, true));

    await act(() => Promise.resolve(null));

    const startDate = new Date('2025-05-19');
    const endDate = new Date('2025-05-30');

    const baseEvent = {
      id: '',
      title: '2일 간격 테스트',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '회의실',
      category: '반복',
      repeat: {
        type: 'daily',
        interval: 2,
        endDate: '2025-05-30',
      },
      notificationTime: 10,
    } as Omit<Event, 'id' | 'date'>;

    const events = generateDailyRepeats(startDate, endDate, 2).map((date) => ({
      ...baseEvent,
      id: '',
      date: date.toISOString().slice(0, 10),
    }));

    for (const event of events) {
      await act(async () => {
        await result.current.saveEvent(event);
      });
    }

    const savedDates = result.current.events.map((e) => e.date);

    expect(savedDates).toEqual([
      '2025-05-19',
      '2025-05-21',
      '2025-05-23',
      '2025-05-25',
      '2025-05-27',
      '2025-05-29',
    ]);
  });

  it('2주마다 반복 일정이 저장되고, 올바른 간격으로 생성된다.', async () => {
    setupMockHandlerEventListCreation();
    const { result } = renderHook(() => useEventOperations(false, true));

    await act(() => Promise.resolve(null));

    const startDate = new Date('2025-05-19');
    const endDate = new Date('2025-06-30');

    const baseEvent = {
      id: '',
      title: '2주 간격 테스트',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '회의실',
      category: '반복',
      repeat: {
        type: 'weekly',
        interval: 2,
        endDate: '2025-06-30',
      },
      notificationTime: 10,
    } as Omit<Event, 'id' | 'date'>;

    const events = generateWeeklyRepeats(startDate, endDate, 2).map((date) => ({
      ...baseEvent,
      id: '',
      date: date.toISOString().slice(0, 10),
    }));

    for (const event of events) {
      await act(async () => {
        await result.current.saveEvent(event);
      });
    }

    const savedDates = result.current.events.map((e) => e.date);

    expect(savedDates.length).toBe(4);
  });

  it('3개월마다 반복 일정이 저장되고, 올바른 간격으로 생성된다.', async () => {
    setupMockHandlerEventListCreation();
    const { result } = renderHook(() => useEventOperations(false, true));

    await act(() => Promise.resolve(null));

    const startDate = new Date('2025-05-19');
    const endDate = new Date('2025-12-30');

    const baseEvent = {
      id: '',
      title: '3개월 간격 테스트',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '회의실',
      category: '반복',
      repeat: {
        type: 'monthly',
        interval: 2,
        endDate: '2025-12-30',
      },
      notificationTime: 10,
    } as Omit<Event, 'id' | 'date'>;

    const events = generateMonthlyRepeats(startDate, endDate, 3).map((date) => ({
      ...baseEvent,
      id: '',
      date: date.toISOString().slice(0, 10),
    }));

    for (const event of events) {
      await act(async () => {
        await result.current.saveEvent(event);
      });
    }

    const savedDates = result.current.events.map((e) => e.date);

    expect(savedDates.length).toBe(3);
  });
});

describe('반복 일정 표시', () => {
  it('반복 일정으로 저장된 이벤트는 제목 앞에 🔁 아이콘이 붙어 UI에 표시된다.', async () => {
    setupMockHandlerEventListCreation();

    const testEvent = {
      id: '',
      title: '테스트 반복 일정',
      date: '2025-05-19',
      startTime: '10:00',
      endTime: '11:00',
      description: '반복 일정 테스트 설명',
      location: '회의실 B',
      category: '업무',
      repeat: {
        type: 'daily',
        interval: 1,
        endDate: '2025-05-20',
      },
      notificationTime: 10,
    } as Omit<Event, 'id'>;

    const { result } = renderHook(() => useEventOperations(false, true));

    await act(async () => {
      await result.current.saveEvent(testEvent);
    });

    // 테스트에 사용할 이벤트를 렌더링
    render(
      <ChakraProvider>
        <EventItem event={result.current.events[0]} isNotified={false} />
      </ChakraProvider>
    );

    expect(screen.getByText('🔁 테스트 반복 일정')).toBeInTheDocument();
  });
});

describe('반복 종료', () => {
  it('반복 종료 조건이 "특정 날짜"일 경우, 해당 날짜까지만 반복 일정이 저장된다.', async () => {
    setupMockHandlerEventListCreation();

    const { result } = renderHook(() => useEventOperations(false, true));
    await act(() => Promise.resolve(null));

    const startDate = new Date('2025-05-01');
    const endDate = new Date('2025-05-05');

    const baseEvent = {
      id: '',
      title: '종료 조건 테스트',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'daily',
        interval: 1,
        endDate: endDate.toISOString().slice(0, 10),
      },
      notificationTime: 10,
    } as Omit<Event, 'id' | 'date'>;

    const events = generateRepeats(startDate, baseEvent.repeat).map((date) => ({
      ...baseEvent,
      id: '',
      date: date.toISOString().slice(0, 10),
    }));

    for (const event of events) {
      await act(async () => {
        await result.current.saveEvent(event);
      });
    }

    const savedDates = result.current.events.map((e) => e.date);

    expect(savedDates).toEqual([
      '2025-05-01',
      '2025-05-02',
      '2025-05-03',
      '2025-05-04',
      '2025-05-05',
    ]);
  });

  it('종료 조건이 "반복 횟수"일 경우, 지정된 횟수만큼 반복된다.', () => {
    const start = new Date('2025-05-20');
    const repeat = {
      type: 'daily',
      interval: 2,
      endDate: '2025-05-25',
    } as RepeatInfo;

    const result = generateRepeats(start, repeat);
    const dates = result.map((d) => d.toISOString().slice(0, 10));

    expect(dates).toEqual(['2025-05-20', '2025-05-22', '2025-05-24']);
  });

  it('종료 조건이 "없음"일 경우, 무한 반복이 가능하다.', () => {
    const start = new Date('2025-05-22');
    const repeat = {
      type: 'daily',
      interval: 1,
    } as RepeatInfo;

    // 테스트에서는 무한 반복을 사용할 수 없으므로 일부만 slice해서 테스트
    const result = generateRepeats(start, repeat);

    const dates = result.slice(0, 10).map((d) => d.toISOString().slice(0, 10));

    expect(dates).toEqual([
      '2025-05-22',
      '2025-05-23',
      '2025-05-24',
      '2025-05-25',
      '2025-05-26',
      '2025-05-27',
      '2025-05-28',
      '2025-05-29',
      '2025-05-30',
      '2025-05-31',
    ]);
  });
});

// describe('반복 일정 단일 수정', () => {
//   it('반복 일정 체크 해제 시 🔁 아이콘이 사라진다.', () => {
//     render(<EventForm />);

//     const checkbox = screen.getByLabelText(/반복 일정/i);
//     const checkboxWrapper = checkbox.closest('label');

//     console.log('chec', checkbox);

//     // 체크 → 체크 해제
//     fireEvent.click(checkbox); // ON
//     expect(checkboxWrapper).toHaveAttribute('data-checked');

//     fireEvent.click(checkbox); // OFF
//     expect(checkboxWrapper).not.toHaveAttribute('data-checked');
//   });

//   it('반복일정을 수정하면 단일 일정으로 변경된다.', () => {
//     const originalEvent = {
//       id: 'abc',
//       title: '매일 아침 회의',
//       date: '2025-05-22',
//       repeat: {
//         type: 'daily',
//         interval: 1,
//         endDate: '2025-06-22',
//       },
//       isRepeating: true,
//     };

//     const updatedEvent = updateRepeatToNone(originalEvent);

//     expect(updatedEvent.repeat.type).toBe('none');
//     expect(updatedEvent.isRepeating).toBe(false); // UI용 부가 확인
//   });
// });
