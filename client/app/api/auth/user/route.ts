// src/app/api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user`, {
            headers: {
                'Authorization': `Bearer ${request.cookies.get('sanctum_token')?.value}`,
            },
        });

        if (response.status === 200) {
            return NextResponse.json(response.data);
        } else {
            return NextResponse.json({ message: 'Error' }, { status: response.status });
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                return NextResponse.json({ message: error.response.data }, { status: error.response.status });
            } else if (error.request) {
                // The request was made but no response was received
                return NextResponse.json({ message: 'No response received from the server' }, { status: 500 });
            } else {
                // Something happened in setting up the request that triggered an Error
                return NextResponse.json({ message: error.message }, { status: 500 });
            }
        } else {
            // Handle other types of errors (if any)
            return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
        }
    }
}
