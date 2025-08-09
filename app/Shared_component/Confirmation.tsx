import React, { useEffect, useRef } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


export default function HeadlessDemo({DeleteTrue,Name}:any) {
    const toast = useRef(null);

   

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    };

    const confirm1 = () => {
        confirmDialog({
            group: 'headless',
            message: `Do you want to Delete ${Name} ?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
           
            reject
        });
    };
   
    useEffect(()=>{
confirm1()   
    },[])
 
      
        

    

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog
                group="headless"
                content={({ headerRef, contentRef, footerRef, hide, message }) => {
                    const { header, message: msg } = message;
                    return (
                        <div className="flex flex-col items-center p-4 bg-white rounded-md shadow-md">
                            <div className="rounded-full bg-black text-white flex justify-center items-center h-30 w-30  mt-3">
                                <i className="pi pi-question " style={{fontSize:'50px'}}></i>
                            </div>
                            <span className="font-bold text-xl mt-6 mb-2" ref={headerRef}>{header}</span>
                            <p className="text-gray-700 text-center" ref={contentRef}>{msg}</p>
                            <div className="flex gap-3 mt-6" ref={footerRef}>
                                <Button style={{background:'#000',color:'#fff'}} label="Cancel" outlined onClick={(e) => { hide(e); reject(); }} className="px-4" />
                               <Button style={{background:'#000',color:'#fff'}} label="OK" onClick={(e) => {
                  toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 50000 });
                  setTimeout(() => DeleteTrue(), 150);
                  
                
                
                }} className="px-4" />
                                
                            </div>
                        </div>
                    );
                }}
            />
           
        </>
    );
}
