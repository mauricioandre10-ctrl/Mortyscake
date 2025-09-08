import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const subscribedCourses = [
    {
        title: "El Arte del Croissant",
        status: "Activa",
        renewalDate: "30 de Julio, 2024",
    },
    {
        title: "La Ciencia del Pan de Masa Madre",
        status: "Expirada",
        renewalDate: "15 de Mayo, 2024",
    }
];

export default function AccountPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center">
            <div className="space-y-8 max-w-4xl w-full">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                        <AvatarImage src="https://picsum.photos/200" alt="Usuario" data-ai-hint="person face" />
                        <AvatarFallback className="text-3xl">PF</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="font-headline text-3xl font-bold">Fan de la Repostería</h1>
                        <p className="text-muted-foreground">fan@pastry.com</p>
                    </div>
                    <Button variant="outline" className="ml-auto w-full sm:w-auto">Editar Perfil</Button>
                </div>
                
                <div>
                    <h2 className="font-headline text-2xl font-bold mb-4">Mis Suscripciones</h2>
                    <div className="border rounded-lg overflow-hidden">
                        <ul className="divide-y divide-border">
                            {subscribedCourses.map((course) => (
                                <li key={course.title} className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 items-center hover:bg-card transition-colors">
                                    <div className="col-span-2 md:col-span-1">
                                        <h3 className="font-semibold">{course.title}</h3>
                                    </div>
                                    <div className="flex justify-start md:justify-center">
                                        <Badge variant={course.status === 'Activa' ? 'default' : 'secondary'} className={course.status === 'Activa' ? 'bg-green-600/20 text-green-300 border-green-500/30' : ''}>{course.status}</Badge>
                                    </div>
                                    <div className="col-span-2 md:col-span-1 text-sm text-muted-foreground">
                                        <p><span className="font-medium text-foreground hidden md:inline">Renueva: </span>{course.renewalDate}</p>
                                    </div>
                                    <div className="flex justify-end col-span-2 md:col-span-1">
                                        <Button variant="outline">Gestionar Suscripción</Button>
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
