import React, { useState, useEffect } from 'react'
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfDay } from 'date-fns'
import { toast } from 'react-toastify'
import { calendarService } from '@/services/api/calendarService'
import { taskService } from '@/services/api/taskService'
import { userService } from '@/services/api/userService'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import TaskFormModal from '@/components/organisms/TaskFormModal'
import TaskModal from '@/components/organisms/TaskModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { cn } from '@/utils/cn'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // month, week, day
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal states
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)

  useEffect(() => {
    loadCalendarData()
    loadUsers()
  }, [currentDate, view])

  const loadCalendarData = async () => {
    try {
      setLoading(true)
      const days = calendarService.generateCalendarDays(currentDate, view)
      const startDate = days[0].dateString
      const endDate = days[days.length - 1].dateString
      
      const calendarEvents = await calendarService.getCalendarEvents(startDate, endDate)
      setEvents(calendarEvents)
      setError(null)
    } catch (err) {
      setError('Failed to load calendar data')
      toast.error('Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const allUsers = await userService.getAll()
      setUsers(allUsers)
    } catch (err) {
      console.error('Failed to load users:', err)
    }
  }

  const handlePrevious = () => {
    switch (view) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1))
        break
      case 'day':
        setCurrentDate(subDays(currentDate, 1))
        break
    }
  }

  const handleNext = () => {
    switch (view) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1))
        break
      case 'day':
        setCurrentDate(addDays(currentDate, 1))
        break
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setShowTaskForm(true)
  }

  const handleEventClick = (event) => {
    if (event.type === 'task') {
      setSelectedTask(event.data)
      setShowTaskModal(true)
    }
  }

  const handleTaskCreate = async (taskData) => {
    try {
      await calendarService.createTaskFromCalendar(selectedDate, taskData)
      toast.success('Task created successfully')
      setShowTaskForm(false)
      loadCalendarData()
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  const handleTaskUpdate = async (taskId, taskData) => {
    try {
      await taskService.update(taskId, taskData)
      toast.success('Task updated successfully')
      setShowTaskModal(false)
      loadCalendarData()
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleDragStart = (e, event) => {
    if (event.type === 'task') {
      setDraggedTask(event)
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, date) => {
    e.preventDefault()
    if (draggedTask) {
      try {
        await calendarService.moveTaskToDate(draggedTask.data.Id, date)
        toast.success('Task moved successfully')
        setDraggedTask(null)
        loadCalendarData()
      } catch (err) {
        toast.error('Failed to move task')
      }
    }
  }

  const getEventsForDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd')
    return events.filter(event => event.date === dateString)
  }

  const getViewTitle = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy')
      case 'week':
        return `Week of ${format(currentDate, 'MMM dd, yyyy')}`
      case 'day':
        return format(currentDate, 'EEEE, MMMM dd, yyyy')
      default:
        return ''
    }
  }

  const renderMonthView = () => {
    const days = calendarService.generateCalendarDays(currentDate, 'month')
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Week headers */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center font-medium text-gray-500 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            return (
              <div
                key={index}
                className={cn(
                  'min-h-[120px] p-2 border-r border-b cursor-pointer hover:bg-gray-50 transition-colors',
                  !day.isCurrentMonth && 'bg-gray-50/50 text-gray-400',
                  day.isToday && 'bg-primary/5 border-primary/20'
                )}
                onClick={() => handleDateClick(day.date)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day.date)}
              >
                <div className={cn(
                  'text-sm font-medium mb-1',
                  day.isToday && 'text-primary'
                )}>
                  {format(day.date, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        'text-xs p-1 rounded truncate cursor-pointer',
                        calendarService.getEventColor(event)
                      )}
                      draggable={event.type === 'task'}
                      onDragStart={(e) => handleDragStart(e, event)}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEventClick(event)
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const days = calendarService.generateCalendarDays(currentDate, 'week')
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            return (
              <div key={index} className="border-r last:border-r-0">
                <div className={cn(
                  'p-4 border-b bg-gray-50 text-center',
                  day.isToday && 'bg-primary/10 text-primary'
                )}>
                  <div className="font-medium text-sm">{weekDays[index]}</div>
                  <div className={cn(
                    'text-2xl font-bold mt-1',
                    day.isToday && 'text-primary'
                  )}>
                    {format(day.date, 'd')}
                  </div>
                </div>
                
                <div 
                  className="min-h-[400px] p-3 space-y-2 cursor-pointer hover:bg-gray-50/50"
                  onClick={() => handleDateClick(day.date)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day.date)}
                >
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        'text-sm p-2 rounded cursor-pointer',
                        calendarService.getEventColor(event)
                      )}
                      draggable={event.type === 'task'}
                      onDragStart={(e) => handleDragStart(e, event)}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEventClick(event)
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      {event.type === 'task' && (
                        <div className="text-xs opacity-80">
                          {event.priority} Priority
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold">{format(currentDate, 'EEEE, MMMM dd')}</h3>
        </div>
        
        <div className="p-4">
          <div 
            className="min-h-[400px] p-4 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            onClick={() => handleDateClick(currentDate)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, currentDate)}
          >
            {dayEvents.length > 0 ? (
              <div className="space-y-3">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer',
                      calendarService.getEventColor(event)
                    )}
                    draggable={event.type === 'task'}
                    onDragStart={(e) => handleDragStart(e, event)}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEventClick(event)
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.type === 'task' && (
                      <div className="text-sm opacity-80 mt-1">
                        Priority: {event.priority} | Status: {event.status}
                      </div>
                    )}
                    {event.type === 'project' && (
                      <div className="text-sm opacity-80 mt-1">
                        Project Deadline | {event.completion}% Complete
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ApperIcon name="Calendar" className="h-12 w-12 mb-2" />
                <p className="text-lg font-medium mb-1">No events today</p>
                <p className="text-sm">Click to add a task</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadCalendarData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage tasks and project deadlines</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="small" onClick={handleToday}>
            Today
          </Button>
          
          <div className="flex items-center border border-gray-200 rounded-lg">
            <Button
              variant="ghost"
              size="small"
              onClick={handlePrevious}
              className="border-0 rounded-r-none"
            >
              <ApperIcon name="ChevronLeft" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleNext}
              className="border-0 rounded-l-none"
            >
              <ApperIcon name="ChevronRight" className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center border border-gray-200 rounded-lg">
            {['month', 'week', 'day'].map((viewType) => (
              <Button
                key={viewType}
                variant={view === viewType ? 'primary' : 'ghost'}
                size="small"
                onClick={() => setView(viewType)}
                className={cn(
                  'border-0 capitalize',
                  viewType !== 'day' && 'rounded-r-none',
                  viewType !== 'month' && 'rounded-l-none'
                )}
              >
                {viewType}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Title */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold text-center">{getViewTitle()}</h2>
      </Card>

      {/* Calendar Views */}
      <div className="min-h-[600px]">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskFormModal
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onSubmit={handleTaskCreate}
          users={users}
          initialData={{
            dueDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
          }}
        />
      )}

      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          task={selectedTask}
          assignee={users.find(u => u.Id === selectedTask.assigneeId)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  )
}

export default Calendar