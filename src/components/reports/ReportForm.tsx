import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MapPin, Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createReport } from "@/services/reportService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReportCategory } from "@/types/schema";

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories: ReportCategory[] = [
  "Traffic",
  "Road Damage", 
  "Water Drainage",
  "Fallen Tree",
  "Street Light Issue",
  "Under Maintenance",
  "Garbage Dumping",
  "Illegal Parking",
  "Other"
];

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100),
  category: z.enum([
    "Traffic", 
    "Road Damage", 
    "Water Drainage", 
    "Fallen Tree", 
    "Street Light Issue", 
    "Under Maintenance", 
    "Garbage Dumping", 
    "Illegal Parking", 
    "Other"
  ], {
    required_error: "Please select a category"
  }),
  location: z.string().min(3, { message: "Please enter a valid location" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
});

type FormData = z.infer<typeof formSchema>;

const ReportForm = ({ isOpen, onClose, onSuccess }: ReportFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: undefined,
      description: "",
      location: "",
    },
  });
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        toast({
          title: "File too large",
          description: "Image must be under 10MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await createReport({
        ...data,
        imageFile: imageFile || undefined,
      });
      
      toast({
        title: "Report submitted!",
        description: "Thank you for helping improve our community.",
      });
      
      form.reset();
      setSelectedImage(null);
      setImageFile(null);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error submitting report",
        description: error.message || "An error occurred while submitting your report.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-md border-white/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Report a Community Issue
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of the issue"
                      className="bg-white/50 border-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/50 border-gray-200">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 backdrop-blur-md border-white/20">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Street address or landmark"
                        className="pl-10 bg-white/50 border-gray-200"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed information about the issue..."
                      className="min-h-[100px] bg-white/50 border-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Photo (Optional)</Label>
              {selectedImage ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="relative">
                      <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                        onClick={() => {
                          setSelectedImage(null);
                          setImageFile(null);
                        }}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload a photo</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-300 hover:bg-gray-50"
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300"
              >
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportForm;
