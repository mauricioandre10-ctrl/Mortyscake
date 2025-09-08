import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const subscribedCourses = [
    {
        title: "Art of the Croissant",
        status: "Active",
        renewalDate: "July 30, 2024",
    },
    {
        title: "Sourdough Bread Science",
        status: "Expired",
        renewalDate: "May 15, 2024",
    }
];

export default function AccountPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="space-y-8 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                        <AvatarImage src="https://picsum.photos/200" alt="User" data-ai-hint="person face" />
                        <AvatarFallback className="text-3xl">PF</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="font-headline text-3xl font-bold">Pastry Fan</h1>
                        <p className="text-muted-foreground">fan@pastry.com</p>
                    </div>
                    <Button variant="outline" className="ml-auto w-full sm:w-auto">Edit Profile</Button>
                </div>
                
                <div>
                    <h2 className="font-headline text-2xl font-bold mb-4">My Subscriptions</h2>
                    <div className="border rounded-lg overflow-hidden">
                        <ul className="divide-y divide-border">
                            {subscribedCourses.map((course) => (
                                <li key={course.title} className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 items-center hover:bg-card transition-colors">
                                    <div className="col-span-2 md:col-span-1">
                                        <h3 className="font-semibold">{course.title}</h3>
                                    </div>
                                    <div className="flex justify-start md:justify-center">
                                        <Badge variant={course.status === 'Active' ? 'default' : 'secondary'} className={course.status === 'Active' ? 'bg-green-600/20 text-green-300 border-green-500/30' : ''}>{course.status}</Badge>
                                    </div>
                                    <div className="col-span-2 md:col-span-1 text-sm text-muted-foreground">
                                        <p><span className="font-medium text-foreground hidden md:inline">Renews: </span>{course.renewalDate}</p>
                                    </div>
                                    <div className="flex justify-end col-span-2 md:col-span-1">
                                        <Button variant="outline">Manage Subscription</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
