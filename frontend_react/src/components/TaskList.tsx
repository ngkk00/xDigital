import React, { useState, useEffect } from 'react';
import type { Task, Developer } from '../types';
import { api } from '../services/api';
import StatusDropdown from './StatusDropdown';
import DeveloperAssignment from './DeveloperAssignment';
import { getErrorMessage } from '../utils/helpers';
import './TaskList.css';

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [loading, setLoading] = useState(true);
    const [taskErrors, setTaskErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [tasksData, developersData] = await Promise.all([
                api.getTasks(),
                api.getDevelopers()
            ]);
            setTasks(tasksData);
            setDevelopers(developersData);
            console.log(tasksData)
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId: string, status: Task['status']) => {
        try {
            await api.updateTaskStatus(taskId, status);
            // Add this to handle when child changes and parent will be updated
            const updatedTasks = await api.getTasks();
            setTasks(updatedTasks);

            setTasks(prev => prev.map(task =>
                task.id === taskId ? { ...task, status } : task
            ));
            // Clear previous error
            setTaskErrors(prev => {
                // destructure to take away property with key taskId and assign with _
                const { [taskId]: _, ...rest } = prev
                return rest
            })
        } catch (error) {
            // Set error message for the task
            setTaskErrors(prev => ({ ...prev, [taskId]: getErrorMessage(error) }));
        }
    };

    const handleAssignDeveloper = async (taskId: string, developerId: string) => {
        try {
            await api.assignDeveloper(taskId, developerId);
            const developer = developers.find(d => d.id === developerId);
            setTasks(prev => prev.map(task =>
                task.id === taskId ? { ...task, assignedDeveloper: developer } : task
            ));
            // Clear previous error
            setTaskErrors(prev => {
                const { [taskId]: _, ...rest } = prev
                return rest
            })
        } catch (error) {
            setTaskErrors(prev => ({ ...prev, [taskId]: getErrorMessage(error) }));
        }
    };

    if (loading) return <div className="loading">Loading...</div>;


    const buildTaskTree = (flatTasks: Task[]): Task[] => {
        const taskMap: Record<string, Task & { subtasks: Task[] }> = {};
        const roots: Task[] = [];

        // Initialize taskMap with empty subtasks
        flatTasks.forEach(task => {
            taskMap[task.id] = { ...task, subtasks: [] };
        });

        // Assign subtasks to their parents
        flatTasks.forEach(task => {
            const parentId = task.parentTask?.id;  // <-- key change here
            if (parentId) {
                const parent = taskMap[parentId];
                if (parent) {
                    parent.subtasks.push(taskMap[task.id]);
                }
            } else {
                roots.push(taskMap[task.id]);
            }
        });

        return roots;
    };


    const renderTaskRow = (task: Task, level: number = 0) => {
        const indentSize = 20;
        const baseIndent = 16;  //set the base indentation so that wont be extreme left
        // Style for the indentation with a vertical line
        const indentStyle = {
            paddingLeft: `${baseIndent + level * indentSize}px`,
            borderLeft: level > 0 ? '2px solid #ccc' : 'none',
            marginLeft: level > 0 ? '4px' : '0',
        };

        // Optional: Different background for subtasks to visually separate
        const rowStyle = {
            backgroundColor: level > 0 ? '#f9f9f9' : 'transparent',
        };

        return (
            <React.Fragment key={task.id}>
                <tr style={rowStyle}>
                    <td style={indentStyle}>{task.title}</td>
                    <td>
                        {task.requiredSkills.map(skill => (
                            <span key={skill.id} className="skill-tag">{skill.name}</span>
                        ))}
                    </td>
                    <td>
                        <StatusDropdown
                            status={task.status}
                            onStatusChange={(status) => handleStatusChange(task.id, status)}
                        />
                        {taskErrors[task.id] && (
                            <div style={{ color: 'red', marginTop: 4 }}>
                                {taskErrors[task.id]}
                            </div>
                        )}
                    </td>
                    <td>
                        <DeveloperAssignment
                            task={task}
                            developers={developers}
                            onAssign={(developerId: string) => handleAssignDeveloper(task.id, developerId)}
                        />
                    </td>
                </tr>

                {/* Recursively render subtasks */}
                {(task.subtasks || []).map(subtask => renderTaskRow(subtask, level + 1))}
            </React.Fragment>
        );
    };


    return (
        <div className="task-list">
            <h2>Task List</h2>
            <table>
                <colgroup>
                    <col style={{ width: '40%' }} />
                    <col style={{ width: '25%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '20%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>Task Title</th>
                        <th>Skills</th>
                        <th>Status</th>
                        <th>Assignee</th>
                    </tr>
                </thead>
                <tbody>
                    {buildTaskTree(tasks).map((task: Task) => renderTaskRow(task))}
                </tbody>
            </table>
        </div>
    );

};

export default TaskList;