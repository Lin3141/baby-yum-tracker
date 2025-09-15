import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Baby, Calendar, Shield, BarChart3, Users, ChevronRight, Heart, Sparkles } from "lucide-react";
import heroImage from "@/assets/baby-food-hero.jpg";

const Welcome = () => {
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const navigate = useNavigate();

  const handleTryApp = () => {
    setIsStartingTrial(true);
    // Small delay for better UX
    setTimeout(() => {
      navigate("/app");
    }, 500);
  };

  const features = [
    {
      icon: Calendar,
      title: "Daily Meal Tracking",
      description: "Log every meal and snack with detailed notes and reactions"
    },
    {
      icon: Shield,
      title: "Allergen Safety",
      description: "Real-time warnings and cross-contamination alerts"
    },
    {
      icon: BarChart3,
      title: "Growth Insights",
      description: "Track patterns and generate health reports"
    },
    {
      icon: Users,
      title: "Multi-Baby Support",
      description: "Manage feeding for multiple children in one app"
    }
  ];

  return (
    <div className="min-h-screen gradient-soft">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Smart</span>{' '}
                  <span className="block gradient-text xl:inline">Baby Feeding</span>{' '}
                  <span className="block xl:inline">Tracker</span>
                </h1>
                <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Track meals, monitor reactions, and keep your baby safe with our intelligent food tracking system. Get insights into feeding patterns and allergen management.
                </p>
                
                {/* Trial Notice */}
                <div className="mt-6 p-4 bg-primary-soft rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-primary">Try Without Signing Up</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Test all features instantly. Your data won't be saved unless you create an account.
                  </p>
                </div>

                <div className="mt-8 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <Button
                    onClick={handleTryApp}
                    disabled={isStartingTrial}
                    size="lg"
                    className="flex items-center gap-2 shadow-button"
                  >
                    {isStartingTrial ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Starting Demo...
                      </>
                    ) : (
                      <>
                        <Baby className="h-5 w-5" />
                        Try the App
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/auth")}
                    size="lg"
                    className="mt-3 sm:mt-0"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Sign Up to Save Data
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src={heroImage}
            alt="Baby eating healthy food"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Everything You Need to Track Baby's Health
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
              Built by parents, for parents. Keep your little one safe and healthy.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="glass-panel border-soft hover:shadow-card transition-all duration-200">
                  <CardHeader className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Card className="glass-panel border-soft p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Ready to Start Tracking?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of parents keeping their babies healthy and safe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">Free Trial</Badge>
                <Badge variant="secondary">No Credit Card</Badge>
                <Badge variant="secondary">Instant Setup</Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleTryApp}
                  disabled={isStartingTrial}
                  size="lg"
                  className="shadow-button"
                >
                  <Baby className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  size="lg"
                >
                  Create Account
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Trial mode lets you explore all features. Sign up to save your data permanently.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Welcome;