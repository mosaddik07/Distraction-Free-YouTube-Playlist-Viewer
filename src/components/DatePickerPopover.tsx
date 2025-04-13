import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';

interface DatePickerPopoverProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  selectedDate,
  onSelect,
}) => {
  const footer = selectedDate ? (
    <p className="mt-4 text-sm text-gray-300">
      Target completion date: {format(selectedDate, 'PPP')}
    </p>
  ) : (
    <p className="mt-4 text-sm text-gray-400">
      Please pick a target completion date
    </p>
  );

  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
        <CalendarIcon size={20} />
        <span>
          {selectedDate
            ? format(selectedDate, 'PPP')
            : 'Set target completion date'}
        </span>
      </Popover.Button>

      <Transition
        enter="transition duration-200 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-150 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="absolute z-10 mt-2">
          <div className="bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-700">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={onSelect}
              footer={footer}
              fromDate={new Date()}
              className="text-white"
              classNames={{
                months: "flex flex-col",
                month: "space-y-4",
                caption: "flex justify-center relative items-center h-10",
                caption_label: "text-sm font-medium text-gray-200",
                nav: "flex items-center space-x-6",
                nav_button: "text-gray-400 hover:text-white",
                nav_button_previous: "absolute left-0",
                nav_button_next: "absolute right-0",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-400 rounded-md w-9 font-normal text-sm",
                row: "flex w-full mt-2",
                cell: "text-sm rounded-md w-9 h-9 text-center text-gray-300 relative p-0 hover:bg-gray-700 focus-within:relative focus-within:z-20",
                day: "w-9 h-9 p-0 font-normal",
                day_selected: "bg-blue-500 text-white hover:bg-blue-600",
                day_today: "text-blue-400 font-bold",
                day_outside: "text-gray-600",
                day_disabled: "text-gray-500",
                day_hidden: "invisible",
              }}
            />
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};