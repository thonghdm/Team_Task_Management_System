import React, { useCallback, useState, useEffect } from 'react';
import { Scheduler } from "@bitnoi.se/react-scheduler";
import "@bitnoi.se/react-scheduler/dist/style.css";
import ChangeList from '~/pages/Projects/Content/TaskBoard/ChangeList';


const Schedulers = ({ dataScheduler }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [filterButtonState, setFilterButtonState] = useState(0);

    const [range, setRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    // const handleRangeChange = useCallback((range) => {
    //     setRange(range);
    // }, []);
    // const filteredMockedSchedulerData = dataScheduler?.map((person) => ({
    //     ...person,
    //     data: Array.isArray(person?.data) // Kiểm tra nếu là mảng
    //         ? person.data.filter(
    //             (project) =>
    //                 dayjs(project.startDate).isBetween(range.startDate, range.endDate) ||
    //                 dayjs(project.endDate).isBetween(range.startDate, range.endDate) ||
    //                 (dayjs(project.startDate).isBefore(range.startDate, "day") &&
    //                     dayjs(project.endDate).isAfter(range.endDate, "day"))
    //         )
    //         : [] // Nếu không phải mảng, gán giá trị mặc định là []
    // }));

    ////////////////////////////////openTaskDetail
    const [showNameMenu, setShowNameMenu] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleOpenNameMenu = (task) => {
        setSelectedTask(task);
        setShowNameMenu(true);
    };
    const handleCloseNameMenu = () => {
        setShowNameMenu(false);
        setSelectedTask(null);
    };

    const handleNameClick = (taskId) => {
        handleOpenNameMenu(taskId);
    };
    ////////////////////////////////////////////////////////////////
    return (
        <>
            <Scheduler
                // decide when to show loading indicators
                isLoading={isLoading}
                // your data
                data={dataScheduler}
                // callback when user click's on one of the grid's tile left side
                onItemClick={(clickedItem) => console.log(clickedItem?.label?._id)}
                // filter function that let's you handling filtering on your end
                onTileClick={(clickedResource) => handleNameClick(clickedResource?.id)}
                // callback when user changes range
                onFilterData={() => {
                    // Some filtering logic...
                    setFilterButtonState(1);
                }}
                onClearFilterData={() => {
                    // Some clearing filters logic...
                    setFilterButtonState(0)
                }}
                config={{
                    /* 
                      change filter button state based on your filters
                      < 0 - filter button invisible,
                      0 - filter button visible, no filter applied, clear filters button invisible,
                      > 0 - filter button visible, filters applied (clear filters button will be visible)
                    */
                    filterButtonState: -1,
                    // decide start zoom variant (0 - weeks, 1 - days)
                    zoom: 1,
                    // select language for scheduler
                    lang: "en",
                    // decide how many resources show per one page
                    maxRecordsPerPage: 20,
                    showThemeToggle: true,
                }}
            />
            {showNameMenu && selectedTask && (
                <ChangeList open={showNameMenu} onClose={handleCloseNameMenu} taskId={selectedTask} />
            )}
        </>
    );
}

export default Schedulers;