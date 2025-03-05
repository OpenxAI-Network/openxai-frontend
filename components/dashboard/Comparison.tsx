'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import "chart.js/auto"; // This is the key import that fixes the issue
import Link from 'next/link';
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Don't use Chart.js in the main component at all
const CloudComparisonSection = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined' || !chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Import Chart.js dynamically to ensure it only runs on client
    import('chart.js').then(({ Chart }) => {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['OpenxAI', 'AWS', 'Google Cloud', 'Microsoft Azure', 'Hugging Face'],
          datasets: [
            {
              label: 'Cost & Energy Consumption',
              data: [3, 7.4, 8.1, 8.6, 6.4],
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              barPercentage: 0.8,
              categoryPercentage: 0.8
            },
            {
              label: 'Content Censorship & Restrictions',
              data: [0, 9.5, 9.2, 9.6, 6.9],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              barPercentage: 0.8,
              categoryPercentage: 0.8
            },
            {
              label: 'Model Ownership, Data Control & Privacy',
              data: [10, 3.2, 3.5, 3.6, 5.4],
              backgroundColor: 'rgba(255, 206, 86, 0.7)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
              barPercentage: 0.8,
              categoryPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // Hide the default legend since we're creating a custom one
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#6A6A6A'
              },
              border: {
                display: false
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                display: false
              },
              border: {
                display: false
              }
            }
          },
          layout: {
            padding: {
              bottom: 80
            }
          },
          backgroundColor: '#1F2021'
        }
      });
      
      // Return cleanup function
      return () => chart.destroy();
    }).catch(error => {
      console.error('Chart error:', error);
    });
  }, []);

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Left column: Cloud Provider Comparison */}
      <div className="rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
        <h2 className="mb-6 text-2xl font-bold">
          <span className="bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
            Cost, Censorship & Privacy Comparison
          </span>
        </h2>
        
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Composition of following models</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'deepseek', display: 'Deepseek' },
              { name: 'llama', display: 'Llama' },
              { name: 'mistral', display: 'Mistral' },
              { name: 'qwen', display: 'Qwen' }
            ].map((model) => (
              <div key={model.name} className="flex items-center">
                <Image 
                  src={`https://studio.openxai.org/images/models/${model.name}.png`}
                  alt={model.name}
                  width={32}
                  height={32}
                  className="mr-2 rounded-md bg-[#1a1a1a] p-1"
                />
                <span className="text-sm text-white">{model.display}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[350px] w-full mt-4">
          {/* Main chart canvas */}
          <canvas ref={chartRef}></canvas>
        </div>

        {/* Provider logos as a separate component below chart */}
        <div className="flex justify-between px-8 -mt-20 mb-4">
          {[
            { name: 'openxai', display: 'OpenXAI' },
            { name: 'aws', display: 'AWS' },
            { name: 'googlecloud', display: 'Google Cloud' },
            { name: 'azure', display: 'Microsoft Azure' },
            { name: 'huggingface', display: 'Hugging Face' }
          ].map((company) => (
            <div key={company.name} className="flex flex-col items-center">
              <Image 
                src={`/providers/${company.name}.png`}
                alt={company.display}
                width={40}
                height={40}
              />
              <span className="text-xs text-gray-400 mt-2">{company.display}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-sm bg-[rgba(255,99,132,0.7)]"></div>
            <span className="text-xs text-gray-400">Cost & Energy</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-sm bg-[rgba(54,162,235,0.7)]"></div>
            <span className="text-xs text-gray-400">Content Censorship</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-sm bg-[rgba(255,206,86,0.7)]"></div>
            <span className="text-xs text-gray-400">Model Ownership & Privacy</span>
          </div>
        </div>
      </div>
      
      {/* Right column: Decentralized Infrastructure */}
      <div className="rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
        <h2 className="mb-10 text-2xl font-bold">
          <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            Decentralized Infrastructure
          </span>
        </h2>
        
        <div className="mb-12">
          <h3 className="mb-6 flex items-center text-lg font-semibold text-white">
            Resources By 
            <span className="ml-2 inline-flex items-center">
              <Image 
                src="/OpenmeshFull.png" 
                alt="Openmesh" 
                width={150} 
                height={150} 
                className="ml-2"
              />
            </span>
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-3">
          <div>
            <div className="text-sm text-[#6A6A6A]">Cost per Compute Hour (CPC)</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-white">$0.12</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-[#6A6A6A]" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average cost per hour of compute resources</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6A6A6A]">Cost per Data Storage TB (CPSD)</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-white">$0.02</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-[#6A6A6A]" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cost per terabyte of data storage</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6A6A6A]">Data Retrieval Cost (DRC)</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-white">$0.02</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-[#6A6A6A]" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cost to retrieve data from storage</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6A6A6A]">Available GPUs</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-white">335 G/F</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-[#6A6A6A]" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total GPUs available in the network</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6A6A6A]">Available Memory</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-white">26 PB</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-[#6A6A6A]" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total memory available in petabytes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6A6A6A]">Available Bandwidth</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-white">900 PB</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-[#6A6A6A]" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total network bandwidth in petabytes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6A6A6A]">Bare Metal Providers</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-white">32</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-[#6A6A6A]" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of bare metal infrastructure providers</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6A6A6A]">Cities & Regions</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-white">482</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-[#6A6A6A]" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Geographic distribution across cities and regions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6A6A6A]">No. of DAO Proposals</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-white">21</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-[#6A6A6A]" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of active DAO governance proposals</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-left">
          <Link 
            href="https://openxai.org" 
            className="text-pink-400 underline transition-colors hover:text-pink-300"
          >
            Become a provider
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CloudComparisonSection; 