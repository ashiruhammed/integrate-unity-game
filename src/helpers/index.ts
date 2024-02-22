
import 'intl';
import 'intl/locale-data/jsonp/en';
import {useFocusEffect} from "@react-navigation/native";
import {useCallback, useRef} from "react";



export const isLessThanTheMB = (fileSize: number, smallerThanSizeMB: number) => {
    const isOk = fileSize / 1024 / 1024 < smallerThanSizeMB
    return isOk
}

const  findOcc = (arr: any[], key: string | number) => {
    let arr2: {}[] = [];

    arr?.forEach((x)=>{

        // Checking if there is any object in arr2
        // which contains the key value
        if(arr2.some((val)=>{ return val[key] == x[key] })){

            // If yes! then increase the occurrence by 1
            arr2.forEach((k)=>{
                if(k[key] === x[key]){
                    k["occurrence"]++
                }
            })

        }else{
            // If not! Then create a new object initialize
            // it with the present iteration key's value and
            // set the occurrence to 1
            let a = {}
            a[key] = x[key]
            a["occurrence"] = 1
            a= {...a, ...x}
            arr2.push(a);
        }
    })

    return arr2
}

//const filteredBadges =  findOcc(badges?.result, "badgeId") || []


export const numberWithCommas = (number: number | string) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const currencyFormatter = (locals: 'en-US' | 'en-NG', currency: 'USD' | 'NGN') => {
    return new Intl.NumberFormat(locals, {
        style: 'currency',
        currency,
minimumFractionDigits:1,
        maximumFractionDigits:2,
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    })
}

export function isWhatPercentOf(x:number, y:number) {
    return (x / y) * 100;
}
export function truncate(str: any, n: number) {
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
}

export function truncateString(str: string, max: number, sep?: string | any[] | undefined) {

    // Default to 10 characters
    max = max || 10;

    var len = str.length;
    if (len > max) {

        // Default to elipsis
        sep = sep || "......";

        var seplen = sep.length;

        // If seperator is larger than character limit,
        // well then we don't want to just show the seperator,
        // so just show right hand side of the string.
        if (seplen > max) {
            return str.substr(len - max);
        }

        // Half the difference between max and string length.
        // Multiply negative because small minus big.
        // Must account for length of separator too.
        var n = -0.5 * (max - len - seplen);

        // This gives us the centerline.
        var center = len / 2;

        var front = str.substr(0, center - n);
        var back = str.substr(len - center + n); // without second arg, will automatically go to end of line.

        return front + sep + back;

    }

    return str;
}

function getDifference(array1: any[], array2: any[]) {
    return array1.filter(object1 => {
        return array2.some(object2 => {
            return object1.id === object2.id;
        });
    });
}


export const toKobo = (amount: string) => {
    const str = amount.replace(',', '.')
    return str.length < 3 || str[str.length - 3] == '.' ? Number(str.replace('.', '')) : Number(str.replace('.', ''))*100
}

//In the below code, refetch is skipped the first time because useFocusEffect calls our callback on mount in addition to screen focus.
export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
    const firstTimeRef = useRef(true)

    useFocusEffect(
        useCallback(() => {
            if (firstTimeRef.current) {
                firstTimeRef.current = false;
                return;
            }

            refetch()
        }, [refetch])
    )
}


export function isLessThan24HourAgo(date: number) {
    // 👇️                    hour  min  sec  milliseconds
    const twentyFourHrInMs = 24 * 60 * 60 * 1000;

    const twentyFourHoursAgo = Date.now() - twentyFourHrInMs;

    return date > twentyFourHoursAgo && date <= Date.now();
}

export const wait = (timeout: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};



export function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}
