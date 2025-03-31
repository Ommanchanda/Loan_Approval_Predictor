import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoanApplicationForm, loanApplicationFormSchema, PredictionResult } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface LoanFormProps {
  onPredictionResult: (result: PredictionResult) => void;
}

export default function LoanForm({ onPredictionResult }: LoanFormProps) {
  const { toast } = useToast();
  
  const form = useForm<LoanApplicationForm>({
    resolver: zodResolver(loanApplicationFormSchema),
    defaultValues: {
      gender: undefined,
      married: undefined,
      dependents: undefined,
      education: undefined,
      selfEmployed: undefined,
      applicantIncome: 0,
      coapplicantIncome: 0,
      loanAmount: 0,
      loanTerm: 360,
      creditHistory: undefined,
      propertyArea: undefined,
    },
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoanApplicationForm) => {
      const response = await apiRequest('POST', '/api/predict', data);
      return response.json();
    },
    onSuccess: (data: PredictionResult) => {
      onPredictionResult(data);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process loan application',
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: LoanApplicationForm) => {
    mutate(data);
  };
  
  return (
    <Card>
      <CardHeader className="bg-primary bg-opacity-10 border-b border-[#e0e0e0]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-primary">Loan Application Form</CardTitle>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary">
              Step 1 of 2
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-md font-medium text-[#212121] mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="married"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Married</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dependents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Dependents</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Number" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3+">3+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Education</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Graduate">Graduate</SelectItem>
                          <SelectItem value="Not Graduate">Not Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="selfEmployed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Self Employed</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Financial Information Section */}
            <div>
              <h3 className="text-md font-medium text-[#212121] mb-4">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="applicantIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Applicant Income (₹)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#757575]">₹</span>
                          <Input
                            type="number"
                            placeholder="0"
                            className="pl-7"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="coapplicantIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Co-applicant Income (₹)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#757575]">₹</span>
                          <Input
                            type="number"
                            placeholder="0"
                            className="pl-7"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Loan Amount (₹)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#757575]">₹</span>
                          <Input
                            type="number"
                            placeholder="0"
                            className="pl-7"
                            min={1000}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="loanTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Loan Term (Months)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="60">60 months</SelectItem>
                          <SelectItem value="120">120 months</SelectItem>
                          <SelectItem value="180">180 months</SelectItem>
                          <SelectItem value="240">240 months</SelectItem>
                          <SelectItem value="300">300 months</SelectItem>
                          <SelectItem value="360">360 months</SelectItem>
                          <SelectItem value="480">480 months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="creditHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Credit History</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Good (1)</SelectItem>
                          <SelectItem value="0">Poor (0)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="propertyArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#757575]">Property Area</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Area" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Urban">Urban</SelectItem>
                          <SelectItem value="Semiurban">Semiurban</SelectItem>
                          <SelectItem value="Rural">Rural</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isPending}
            >
              {isPending ? "Processing..." : "Predict Loan Approval"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
