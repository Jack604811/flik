"use client";


interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;

}

export function CustomerPortalLink({ children, ...props }: Props) {

    function goToCustomerPortal() {
        console.log("running")
        fetch("/api/stripe/create-customer-portal-session", {
            method: "POST",
        })
            .then(response => response.json())
            .then(data => {
                const redirectUrl = data.url;
                window.location.assign(redirectUrl);
            });
    }

    return (
        <button onClick={goToCustomerPortal} {...props}>
            {children}
        </button>
    );
}