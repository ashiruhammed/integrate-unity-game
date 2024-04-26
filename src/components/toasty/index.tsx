import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Text, View, StyleSheet} from 'react-native';
import {useSharedValue} from "react-native-reanimated";
import SwipeToast from "./SwipeToast";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {clearNotification, removeNotificationItem, removeSingleNotification} from "../../app/slices/dataSlice";
import {useDispatch, useSelector} from "react-redux";


interface TaskInterface {
    index: number;
    id: string;
    type: 'error' | 'success' | 'info';
    body: string;
}


const NOTIFICATIONSDATA = [
    {
        id: Math.random(),
        type: 'error',

        body: 'Record the dismissible tutorial 🎥'
    }, {
        id: Math.random(),
        body: 'Leave 👍🏼 to the video',
        type: 'success'
    },
    {
        id: Math.random(),
        type: 'info',
        body: 'Subscribe to the channel 🚀',
    }


]
const layout = {
    borderRadius: 16,

    spacing: 12,
    cardsGap: 22,
}

const SwipeAnimatedToast = () => {

    const dispatch = useAppDispatch()
    const data = useAppSelector(state => state.data)
    const {notificationData} = data

    // let TASKS: { index: number; body: string; type: string }[] = [];
    const [tasks, setTasks] = useState(notificationData.map((item, index) => ({
        body: item.body,
        type: item.type,
        id: item.id,
        index
    })));


    useEffect(() => {
        setTasks(notificationData.map((item, index) => ({body: item.body, type: item.type, id: item.id, index})))
    }, [notificationData]);


    const onDismiss = useCallback((notification: TaskInterface) => {

        setTasks((tasks) => tasks.filter((item) => item.index !== notification.index).reverse());
        // tasks  = tasks.filter((item) => item.index !== notification.index)
        // dispatch(removeSingleNotification(task))
        dispatch(removeNotificationItem({notification}))
    }, []);

    const scrollRef = useRef(null);
    const activeIndex = useSharedValue(0)


      useEffect(() => {
          // console.log(user)
          let time: NodeJS.Timeout | undefined;
          if (notificationData.length > 0) {


              time = setTimeout(() => {
                  dispatch(clearNotification())
              }, 3500)

          }
          return () => {
              clearTimeout(time)
          };
      }, [notificationData])



    return (

        <View
            style={{


                zIndex: 1000,

                alignItems: 'center',

                justifyContent: 'flex-end',
                // marginBottom: layout.cardsGap * 2,




                width:'100%',
                position: 'absolute',
                left: 0,
                right: 0,

                bottom: 60,


            }}
            pointerEvents="box-none"
        >
            {tasks.map((task, index) => (
                <SwipeToast
                    activeIndex={activeIndex}
                    totalLength={tasks.length}
                    index={index}
                    simultaneousHandlers={scrollRef}
                    key={task.id}
                    task={task}
                    onDismiss={onDismiss}
                />
            ))}


        </View>
    );
};

const styles = StyleSheet.create({})

export default SwipeAnimatedToast;
