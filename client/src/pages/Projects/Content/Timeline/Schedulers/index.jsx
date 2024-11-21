import React, { useCallback, useState, useEffect } from 'react';
import { Scheduler } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";

import mockedSchedulerData from "./mockedSchedulerData";
const Schedulers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [filterButtonState, setFilterButtonState] = useState(0);

    const [range, setRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    // const handleRangeChange = useCallback((range) => {
    //     setRange(range);
    // }, []);

    const filteredMockedSchedulerData = mockedSchedulerData.map((person) => ({
        ...person,
        data: person.data.filter(
            (project) =>
                // we use "dayjs" for date calculations, but feel free to use library of your choice
                dayjs(project.startDate).isBetween(range.startDate, range.endDate) ||
                dayjs(project.endDate).isBetween(range.startDate, range.endDate) ||
                (dayjs(project.startDate).isBefore(range.startDate, "day") &&
                    dayjs(project.endDate).isAfter(range.endDate, "day"))
        )
    }))
    return (
        <Scheduler
            // decide when to show loading indicators
            isLoading={isLoading}
            // your data
            data={filteredMockedSchedulerData}
            // callback when user click's on one of the grid's tile
            onItemClick={(clickedItem) => console.log(clickedItem)}
            // filter function that let's you handling filtering on your end
            onTileClick={(clickedResource) => console.log(clickedResource)}
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
                zoom: 0,
                // select language for scheduler
                lang: "en",
                // decide how many resources show per one page
                maxRecordsPerPage: 20,
            }}
        />
    );
}

export default Schedulers;