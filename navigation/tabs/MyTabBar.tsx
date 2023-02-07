import * as React from "react";

import { IAppearanceOptions, TabButtonLayout, TabElementDisplayOptions } from './types';
import {
    TabRouter,
    createNavigatorFactory,
    useNavigationBuilder,
} from "@react-navigation/native";

import TabBarElement from "./TabBarElement";
import {TextStyle, ViewStyle} from "react-native";

const defaultAppearance: IAppearanceOptions = {
    topPadding: 10,
    bottomPadding: 10,
    horizontalPadding: 10,
    tabBarBackground: "#FFFFFF",
    floating: false,
    dotCornerRadius: 100,
    whenActiveShow: TabElementDisplayOptions.BOTH,
    whenInactiveShow: TabElementDisplayOptions.BOTH,
    shadow: false,
    tabButtonLayout: TabButtonLayout.HORIZONTAL,
    activeColors: undefined,
    activeTabBackgrounds: undefined,
};

const defaultTabBarOptions = {
    activeTintColor: "black",
    inactiveTintColor: "black",
    activeBackgroundColor: "#6471ff",
    labelStyle: {  fontWeight: "bold", fontSize:12}
};

interface IBottomTabNavigatorProps {
    initialRouteName?: string;
    backBehavior?: "history" | "initialRoute" | "order" | "none" | undefined;
    children: React.ReactNode;
    screenOptions?: any;
    tabBarOptions: {
        labelStyle?: TextStyle,
        tabStyle?: ViewStyle,
        activeTintColor: string,
        inactiveTintColor: string,
        activeBackgroundColor: string
    };
    appearance: Partial<IAppearanceOptions>;
}

const BottomTabNavigator = ({
                                    initialRouteName,
                                    backBehavior,
                                    children,
                                    screenOptions,
                                    tabBarOptions,
                                    appearance,
                                    ...rest
                                }: IBottomTabNavigatorProps) => {

    const { state, descriptors, navigation } = useNavigationBuilder(TabRouter, {
        initialRouteName,
        backBehavior,
        children,
        screenOptions,
    });

    const finalAppearance: IAppearanceOptions = {
        ...defaultAppearance,
        ...appearance
    }

    const finalTabBarOptions = {
        ...defaultTabBarOptions,
        ...tabBarOptions
    }

    return (
        <TabBarElement
            {...rest}
            state={state}
            navigation={navigation}
            descriptors={descriptors}
            tabBarOptions={finalTabBarOptions}
            appearance={finalAppearance}
        />
    );
}

BottomTabNavigator.defaultProps = {
    lazy: true,
};

//Custom navigators need to wrap the navigator component in createNavigatorFactory before exporting.
export default createNavigatorFactory(BottomTabNavigator);
