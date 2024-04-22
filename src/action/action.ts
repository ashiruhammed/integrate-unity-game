import * as SecureStore from 'expo-secure-store';
import {BASE_URL, ACCESS_TOKEN, DEV_BASE_URL} from "@env";
//const access_token = 'JGFyZ29uMmlkJHY9MTkkbT00MDk2LHQ9MyxwPTEkWnJjNEVDR05JTEYzU3B2WUJLZVBZdyRtdnNacUl6VVg3SG1UV2gvdjhQZXZGUXJOa1hWYUFHRkVKV3dCd0NobDBV'
const BASE_URL_LIVE = __DEV__ ? DEV_BASE_URL : BASE_URL

interface signupProps {
    "email": string,
    "phone": string,
    "fullName": string,
    "password": string,
    "referralCode"?: ""
}

export const loginUser = async (userData: {}) => {
    //let Token = await SecureStore.getItemAsync('token');
    // await setHeaderToken(Token)

    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: userData,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/auth/signin`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

    // return request.post(`/auth/login`, {userData})


}


export const userAppleOAuth = async (userData: {}) => {
    //let Token = await SecureStore.getItemAsync('token');
    // await setHeaderToken(Token)
    /*  const response = await request.get(
          `/`,
      );*/

    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: userData,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/auth/apple/callback`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

    // return request.post(`/auth/login`, {userData})


}

export const userGoogleAuth = async (userData: {}) => {
    //let Token = await SecureStore.getItemAsync('token');
    // await setHeaderToken(Token)
    /*  const response = await request.get(
          `/`,
      );*/
    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: userData,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/auth/google/callback`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

    // return request.post(`/auth/login`, {userData})


}


export const userFBOAuth = async (userData: any) => {

    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: userData,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/auth/facebook/callback`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

    // return request.post(`/auth/login`, {userData})


}


export const createAccount = async (userdata: signupProps) => {
    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: userdata,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/auth/signup`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

}


export const requestCode = async (userdata: signupProps) => {
    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: userdata,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/auth/confirmation/request/email`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

}
export const reqPasswordResetCode = async (userdata: signupProps) => {
    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: userdata,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/auth/password/reset`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

}


export const confirmEmail = async (userdata: signupProps) => {
    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: userdata,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/auth/confirmation/email`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

}


export const verifyPhone = async (userdata: any) => {


    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: userdata,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/phone/verify`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

}


export const updatePhoneNumberVerify = async (userdata: any) => {


    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: userdata,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/phone/update`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

}


export const getUserSettings = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/preferences`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const userSettings = async (userdata: any) => {


    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: userdata,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/preferences/update`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

}


export const requestPhoneVerification = async (userdata: any) => {


    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: userdata,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/phone`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

}


export const passwordReset = async (userdata: signupProps) => {
    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: userdata,
    };

    return Promise.race([
        fetch(`${BASE_URL_LIVE}/auth/password/reset`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])

}


export const getUser = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/me`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const updateUserImage = async (imageUrl: any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');
    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout

    const body = JSON.stringify({
        imageUrl
    })

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/avatar`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const userNotifications = {

    notifications: async ({pageParam = 1}: { pageParam?: number }) => {
        let Token = await SecureStore.getItemAsync('Gateway-Token');
        //console.log(Token)
        let timeoutId: NodeJS.Timeout
        const myHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`,
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
        }


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return Promise.race([
            fetch(`${BASE_URL_LIVE}/notification`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 15000)

            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}
export const referralDashboard = {

    referrals: async ({pageParam = 1}: { pageParam?: number }) => {
        let Token = await SecureStore.getItemAsync('Gateway-Token');
        // console.log(Token)
        let timeoutId: NodeJS.Timeout
        const myHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`,
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
        }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return Promise.race([
            fetch(`${BASE_URL_LIVE}/referral/dashboard`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 15000)

            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}


export const userNFTs = {

    NFTs: async ({pageParam = 1}: { pageParam?: number }) => {
        let Token = await SecureStore.getItemAsync('Gateway-Token');
        // console.log(Token)
        let timeoutId: NodeJS.Timeout
        const myHeaders = {
            'Authorization': `Bearer ${Token}`,
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
        }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return Promise.race([
            fetch(`${BASE_URL_LIVE}/nft/me?pageSize=10&pageNumber=${pageParam}`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 15000)

            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}


export const userLeaderboards = {

    leaderboard: async ({pageParam = 1}: { pageParam?: number }) => {
        let Token = await SecureStore.getItemAsync('Gateway-Token');
        // console.log(Token)
        let timeoutId: NodeJS.Timeout
        const myHeaders = {
            'Authorization': `Bearer ${Token}`,
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
        }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return Promise.race([
            fetch(`${BASE_URL_LIVE}/point/leaderboard/top?pageSize=10&pageNumber=${pageParam}`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 15000)

            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}


export const getUserDashboard = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/dashboard`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getUserRank = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/point/rank`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const uploadToCloudinary = async ({body, resource_type}: { body: any, resource_type: string }) => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic e3thcGlfa2V5fX06e3thcGlfc2VjcmV0fX0=");
    myHeaders.append("Content-Type", 'multipart/form-data')
    let timeoutId: NodeJS.Timeout

    /*  const formdata = new FormData();
      formdata.append("file", image, "[PROXY]");
      formdata.append("upload_preset", "wzmsno1n");
      formdata.append("api_key", "321282857135333");*/
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };

//https://api.cloudinary.com/v1_1/dijyr3tlg/${resource_type}/upload
    return Promise.race([
        fetch(`https://api.cloudinary.com/v1_1/demo/image/upload`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const updateCompleteProfile = async (body: {}) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/complete`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getUserWallets = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/wallet`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getUserTransaction = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/transaction`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getUserPoints = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/wallet/point`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getUserPointsExchangeRate = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/point/exchange/rates`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}

export const redeemPoints = async (body: {}) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        "Content-Type": "application/json",
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/point/redeem`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getReferralLeaderboard = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/referral/leaderboard`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getPointsLeaderboard = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/point/leaderboard/bottom?pageSize=10`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const generateReferralCode = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/referral/code`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const generateReferralHistory = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/referral/history`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const referralPoints = {

    points: async ({pageParam = 1}: { pageParam: number }) => {


        let Token = await SecureStore.getItemAsync('Ports-Token');
        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/referral/history`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 25000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])

    }
}


export const withdrawFromWallet = async (body: {}) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        "Content-Type": "application/json",
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/wallet/withdraw`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const leaveAReview = async (body: {}) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        "Content-Type": "application/json",
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/review`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getUserCompletedAdventure = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/adventure/enrollment/completed`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getAllAdventure = {

    adventures: async (pageParam: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,

        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/adventure`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}


export const getEnrolledAdventure = {
    userEnrolled: async (pageParam: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,

        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/adventure/enrollment`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}
export const getInProgressAdventure = {
    inProgress: async (pageParam: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,

        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/adventure/enrollment/progress`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}


export const getAdventure = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/adventure/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getAdventureReviews = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/review/adventure/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getModuleByAdventure = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/module/adventure/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getLessonsByModule = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/lesson/module/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getLesson = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/lesson/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getQuizByLesson = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/quiz/lesson/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}

export const getBadges = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/badge/user`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getUserBadges = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/badge/user/dashboard`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getAllBadges = {

    badges: async (pageParam: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,

        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/badge/user/dashboard`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}


export const getFollowedCommunities = {

    communities: async (pageParam: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/community/following`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}
export const getMyCommunities = {

    mine: async () => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/community/user`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}


export const getPublicCommunities = {

    communities: async (pageParam: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/community`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}
export const getAllCommunities = {

    communities: async (status: 'DECLINED' | 'PENDING') => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/community/status?status=${status}`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}


export const getPrivateCommunities = {

    communities: async (pageParam: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/community/type?type=PRIVATE`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}
export const getCommunityPosts = {
    posts: async (pageParam: string, id: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        //  https://api.gatewayapp.co/post/comment/replies/de9314a5-0507-43b3-987b-30ee30526942

        return Promise.race([
            fetch(`${BASE_URL_LIVE}/post/community/${id}`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}

export const getPostComments = {
    comments: async (pageParam: string, id: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/post/comment/${id}`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}

export const getCommentReplies = {
    comments: async (pageParam: string, id: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/post/comment/replies/${id}`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}


export const replyToComment = async (body: any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout
    /*   content:"yea"
       parentId:"a7f152f3-3c1b-4ff8-92d9-a5311c6b5a0e"
       postId:"9c065ab3-f150-4693-9c9a-9d64af8a1213"*/

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/post/comment`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const commentOnAPost = async (body: any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/post/comment`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const likeAComment = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/post/comment/like/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const likeAPost = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/post/like/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getPostLike = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/post/likes/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const postToCommunity = async ({body}: { body: any }) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/post/community`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getCommunityPost = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/post/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getCommunityFollowers = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/community/followers/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const communityRequests = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/community/request/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getCommunityInfo = async (id?: string | any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/community/${id}/info`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const unFollowCommunity = async (id?: string | any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/community/unfollow/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const blockUser = async (body?: any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/block`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const unblockUser = async (body?: any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/unblock`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const blockedUsers = {

    blockedList: async (pageParam: string) => {

        let Token = await SecureStore.getItemAsync('Gateway-Token');

        const myHeaders = {
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
            'Authorization': `Bearer ${Token}`
        }
        let timeoutId: NodeJS.Timeout


        const requestOptions = {
            method: 'GET',
            headers: myHeaders,

        };


        return Promise.race([
            fetch(`${BASE_URL_LIVE}/user/blocked/list`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

                //  clearTimeout(timeoutId)
            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}
export const flagPost = async (body?: any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/post/flag`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const approveCommunityRequest = async (id?: string | any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/community/request/accept/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const declineCommunityRequest = async (id?: string | any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/community/request/decline/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const allAvailableBadges = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/badge`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getSingleBadge = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/badge/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getModuleTask = async (id: string) => {
    let Token = await SecureStore.getItemAsync('Gateway-Token');
    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/task/module/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const submitTask = async ({id, body}: { id: string, body: any }) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/task/${id}/submit`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const followACommunity = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/community/follow/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const createCommunity = async (body) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/community`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const submitQuizAnswers = async ({body, id}: { id: string, body: string, }) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body,
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/quiz/${id}/submit`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const startAdventure = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/adventure/${id}/start`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const updateVideoWatchCount = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/lesson/${id}/video-watch`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}

export const getNextAdventure = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/adventure/${id}/next`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const changePassword = async (body: {}) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body,
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/auth/password/change`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}

export const requestDeleteAccount = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/delete`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const deleteAccountNow = async (body: any) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/user/delete/confirm`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


/* PRODUCT DISCOVERY*/
export const getProductCategories = async () => {
    let Token = await SecureStore.getItemAsync('Gateway-Token');
    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/product-hunt/categories`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getProductTrending = async () => {
    let Token = await SecureStore.getItemAsync('Gateway-Token');
    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/product-hunt/trending`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getApprovedProduct = async () => {
    let Token = await SecureStore.getItemAsync('Gateway-Token');
    const myHeaders = {
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Authorization': `Bearer ${Token}`
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/product-hunt`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const registerProductHunt = async ({body}: { body: any }) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/product-hunt/register`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const commentOnProduct = async ({body}: { body: any }) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/product-hunt/comment`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getSingleProduct = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/product-hunt/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getProductComment = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/product-hunt/comment/${id}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const upVoteProduct = async (id: string) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/product-hunt/${id}/upvote`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const aiAdventures = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/adventure/ai`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const createAIAdventure = async ({body}: { body: any }) => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
        'Content-Type': 'application/json',
    }
    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/magic/create`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}



export const createWalletIdentity = async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }


    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'POST',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/wallet/create-identity`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const getCCDWallet= async () => {

    let Token = await SecureStore.getItemAsync('Gateway-Token');

    const myHeaders = {
        'Authorization': `Bearer ${Token}`,
        'x-access-token': ACCESS_TOKEN,
        'x-client-type': 'web',
    }


    let timeoutId: NodeJS.Timeout


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };


    return Promise.race([
        fetch(`${BASE_URL_LIVE}/wallet/concordium-wallet`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}







export const getPointsHistory = {

    history: async ({pageParam = 1}: { pageParam?: number }) => {
        let Token = await SecureStore.getItemAsync('Gateway-Token');
        // console.log(Token)
        let timeoutId: NodeJS.Timeout
        const myHeaders = {
            'Authorization': `Bearer ${Token}`,
            'x-access-token': ACCESS_TOKEN,
            'x-client-type': 'web',
        }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return Promise.race([
            fetch(`${BASE_URL_LIVE}/point/history?pageSize=10&pageNumber=${pageParam}`, requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Timeout')), 15000)

            }).then(() => {
                clearTimeout(timeoutId)
            })

        ])
    }
}
