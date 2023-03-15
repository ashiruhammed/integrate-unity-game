//const BASE_URL = "https://gateway-api.onrender.com"
//export const BASE_URL = "https://gateway-backend.onrender.com"
//export const BASE_URL = "https://api.gatewayapp.co"
import * as SecureStore from 'expo-secure-store';
import {BASE_URL, ACCESS_TOKEN, DEV_BASE_URL} from "@env";
//const access_token = 'JGFyZ29uMmlkJHY9MTkkbT00MDk2LHQ9MyxwPTEkWnJjNEVDR05JTEYzU3B2WUJLZVBZdyRtdnNacUl6VVg3SG1UV2gvdjhQZXZGUXJOa1hWYUFHRkVKV3dCd0NobDBV'
//const BASE_URL = __DEV__ ? DEV_BASE_URL : PROD_URL

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
        fetch(`${BASE_URL}/auth/signin`, requestOptions)
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
        fetch(`${BASE_URL}/auth/apple/callback`, requestOptions)
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
        fetch(`${BASE_URL}/auth/google/callback`, requestOptions)
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
        fetch(`${BASE_URL}/auth/facebook/callback`, requestOptions)
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
        fetch(`${BASE_URL}/auth/signup`, requestOptions)
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
        fetch(`${BASE_URL}/auth/confirmation/request/email`, requestOptions)
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
        fetch(`${BASE_URL}/auth/password/reset`, requestOptions)
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
        fetch(`${BASE_URL}/auth/confirmation/email`, requestOptions)
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
        fetch(`${BASE_URL}/user/phone/verify`, requestOptions)
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
        fetch(`${BASE_URL}/user/phone/update`, requestOptions)
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
        fetch(`${BASE_URL}/preferences`, requestOptions)
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
        fetch(`${BASE_URL}/preferences/update`, requestOptions)
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
        fetch(`${BASE_URL}/user/phone`, requestOptions)
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
        fetch(`${BASE_URL}/auth/password/reset`, requestOptions)
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
        fetch(`${BASE_URL}/user/me`, requestOptions)
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
        fetch(`${BASE_URL}/user/avatar`, requestOptions)
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
            fetch(`${BASE_URL}/notification`, requestOptions)
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
            fetch(`${BASE_URL}/referral/dashboard`, requestOptions)
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
            fetch(`${BASE_URL}/nft/me?pageSize=10&pageNumber=${pageParam}`, requestOptions)
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
            fetch(`${BASE_URL}/point/leaderboard/top?pageSize=10&pageNumber=${pageParam}`, requestOptions)
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
        fetch(`${BASE_URL}/user/dashboard`, requestOptions)
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
        fetch(`${BASE_URL}/point/rank`, requestOptions)
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


    return Promise.race([
        fetch(`https://api.cloudinary.com/v1_1/dijyr3tlg/${resource_type}/upload`, requestOptions)
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
        fetch(`${BASE_URL}/user/complete`, requestOptions)
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
        fetch(`${BASE_URL}/wallet`, requestOptions)
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
        fetch(`${BASE_URL}/transaction`, requestOptions)
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
        fetch(`${BASE_URL}/wallet/point`, requestOptions)
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
        fetch(`${BASE_URL}/point/exchange/rates`, requestOptions)
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
        fetch(`${BASE_URL}/point/redeem`, requestOptions)
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
        fetch(`${BASE_URL}/referral/leaderboard`, requestOptions)
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
        fetch(`${BASE_URL}/point/leaderboard/bottom?pageSize=10`, requestOptions)
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
        fetch(`${BASE_URL}/user/referral/code`, requestOptions)
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
        fetch(`${BASE_URL}/referral/history`, requestOptions)
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
            fetch(`${BASE_URL}/referral/history`, requestOptions)
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
        fetch(`${BASE_URL}/wallet/withdraw`, requestOptions)
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
        fetch(`${BASE_URL}/review`, requestOptions)
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
        fetch(`${BASE_URL}/adventure/enrollment/completed`, requestOptions)
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
            fetch(`${BASE_URL}/adventure`, requestOptions)
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
            fetch(`${BASE_URL}/adventure/enrollment`, requestOptions)
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
            fetch(`${BASE_URL}/adventure/enrollment/progress`, requestOptions)
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
        fetch(`${BASE_URL}/adventure/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/review/adventure/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/module/adventure/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/lesson/module/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/lesson/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/quiz/lesson/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/badge/user`, requestOptions)
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
        fetch(`${BASE_URL}/badge/user/dashboard`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


export const getAllBadges =
    {

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
                fetch(`${BASE_URL}/badge/user/dashboard`, requestOptions)
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
            fetch(`${BASE_URL}/community/following`, requestOptions)
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
            fetch(`${BASE_URL}/community/user`, requestOptions)
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
            fetch(`${BASE_URL}/community`, requestOptions)
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
            fetch(`${BASE_URL}/community/type?type=PRIVATE`, requestOptions)
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


        return Promise.race([
            fetch(`${BASE_URL}/post/community/${id}`, requestOptions)
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
            fetch(`${BASE_URL}/post/comment/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/post/comment`, requestOptions)
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
        fetch(`${BASE_URL}/post/comment/like/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/post/like/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/post/likes/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/post/community`, requestOptions)
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
        fetch(`${BASE_URL}/post/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/community/followers/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/community/request/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/community/${id}/info`, requestOptions)
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
        fetch(`${BASE_URL}/community/unfollow/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/community/request/accept/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/community/request/decline/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/badge`, requestOptions)
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
        fetch(`${BASE_URL}/badge/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/task/module/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/task/${id}/submit`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const followACommunity = async ({id}: { id: string }) => {

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
        fetch(`${BASE_URL}/community/follow/${id}`, requestOptions)
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
        fetch(`${BASE_URL}/community`, requestOptions)
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
        fetch(`${BASE_URL}/quiz/${id}/submit`, requestOptions)
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
        fetch(`${BASE_URL}/adventure/${id}/start`, requestOptions)
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
        fetch(`${BASE_URL}/lesson/${id}/video-watch`, requestOptions)
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
        fetch(`${BASE_URL}/adventure/${id}/next`, requestOptions)
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
        fetch(`${BASE_URL}/auth/password/change`, requestOptions)
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
        fetch(`${BASE_URL}/user/delete`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}
export const deleteAccountNow = async (body:any) => {

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
        fetch(`${BASE_URL}/user/delete/confirm`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}


