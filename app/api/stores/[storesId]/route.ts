import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { storesId: string } }
  ) {
    try {
        console.log(params);
        
      const { userId } = auth();
      const body = await req.json();
  
      const { name } = body;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!name) {
        return new NextResponse("Name is required", { status: 400 });
      }
  
      if (!params.storesId) {
        return new NextResponse("Store id is required", { status: 400 });
      }
  
      const store = await prismadb.store.updateMany({
        where: {
          id: params.storesId,
          userId,
        },
        data: {
          name
        }
      });
    
      return NextResponse.json(store);
    } catch (error) {
      console.log('[STORE_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  
  

export async function DELETE(
    _req: Request,
    { params }: {params: {storesId:string}}
) {
    try {
        const {userId} = auth();
        
             
        if(!userId) {
            return new NextResponse('Unauthorized', {status: 401})
        }
       
        if (!params.storesId){
            return new NextResponse('Store id is requires', { status: 400 })
        }
        
        const store = await prismadb.store.deleteMany({
            where:{
                id: params.storesId,
                userId
            }
            
        })
        return NextResponse.json(store)

    } catch (err) {
        console.log('[STORE_DELETE]', err);
        return new NextResponse('Internal Error', {status: 500});
    }
}