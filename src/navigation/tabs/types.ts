
export enum TabElementDisplayOptions {
    ICON_ONLY = "icon-only",
    LABEL_ONLY = 'label-only',
    BOTH = 'both'
}


export enum TabButtonLayout {
    HORIZONTAL = 'horizontal'
}


export interface IAppearanceOptions {
    topPadding: number;
    bottomPadding: number;
    horizontalPadding: number;
    tabBarBackground: string;
    activeTabBackgrounds?: string | string[];
    activeColors?: string | string[];
    floating: boolean;
    dotCornerRadius: number;
    whenActiveShow: TabElementDisplayOptions;
    whenInactiveShow: TabElementDisplayOptions;
    shadow: boolean;
    tabButtonLayout: TabButtonLayout
}
