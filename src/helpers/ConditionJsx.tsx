

export function IF(props: { condition: any | boolean; children: any }){
    if(!!props.condition){
        return props.children
    }
    return null
}


export function WHEN(props: { condition: any | number; children: any }){
    if(props.condition !== null || true || undefined){
        return props.children
    }
    return null
}


export function CaseCondition({ status ,children }: string | any) {
    return (
        <>
            {(function() {
                switch (status) {
                    case 'confirmed':
                                return children;
                    case 'submitted':
                        return children
                    case 'processing':
                        return children
                    default:
                        return null;
                }
            })()}
    </>
);
}


