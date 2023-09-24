import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
    req:Request,
    {params} : {params:{storeId: string}}
) {
    try{
        const {userId}  = auth(); 
        const body =  await req.json();

        const {label, imgUrl} = body;

        if(!userId) {
            return new NextResponse('Unauthenticated', {status: 401})
        }

        if (!label){
            return new NextResponse('Label is required', { status: 400 })
        }

        if (!imgUrl){
            return new NextResponse('Image URL is required', { status: 400 })
        }

        if (!params.storeId){
            return new NextResponse('Store id  is required', { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse('Unauthorized' , {status: 403})
        }

        const billboard = await prismadb.billboard.create({
            data:{
                label,
                imgUrl,
                storeId: params.storeId
            }
        })

        return NextResponse .json(billboard);
    } catch (err) {
        console.log('[BILLBOARDS_POST]', err);
        return new NextResponse('Internal Error', {status: 500});
    }
}


export async function GET(
    req:Request,
    {params} : {params:{storesId: string}}
) {
    try{
        
       
        if (!params.storesId){
            return new NextResponse('Store id  is required', { status: 400 })
        }

        

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storesId,
            }
        })

        return NextResponse .json(billboards);
    } catch (err) {
        console.log('[BILLBOARDS_GET]', err);
        return new NextResponse('Internal Error', {status: 500});
    }
}