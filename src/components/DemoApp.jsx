import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, Info } from 'lucide-react';

const demoData = {
  baseInfo: {
    sections: [
      {
        title: "Принцип работы системы",
        points: [
          "Анализ миллионов реальных карьерных переходов",
          "Построение взвешенного графа карьерных путей",
          "Использование весов для определения оптимальных маршрутов",
        ]
      },
      {
        title: "Как строятся маршруты",
        points: [
          "Приоритизация частых и успешных переходов",
          "Учёт релевантности профессий и навыков",
          "Оптимизация длины и сложности пути",
        ]
      },
      {
        title: "Технологии",
        points: [
          "Графовая БД для хранения связей между профессиями",
          "Векторная БД для сопоставления описаний",
          "ML-модели для анализа резюме и построения маршрутов",
        ]
      }
    ]
  },
  forwardPaths: {
    from: "Продавец-консультант",
    paths: [
      {
        path: ["Продавец-консультант", "Старший продавец", "Заместитель управляющего", "Управляющий магазином"],
        weight: 0.85,
        description: "Классический путь развития в ритейле с фокусом на управление"
      },
      {
        path: ["Продавец-консультант", "Мерчендайзер", "Территориальный мерчендайзер", "Руководитель отдела мерчендайзинга"],
        weight: 0.75,
        description: "Специализация в визуальном мерчендайзинге и управлении категориями"
      },
      {
        path: ["Продавец-консультант", "Специалист по работе с клиентами", "Руководитель отдела продаж"],
        weight: 0.70,
        description: "Развитие в направлении продаж и работы с ключевыми клиентами"
      }
    ]
  },
  backwardPaths: {
    to: "Шеф-повар",
    paths: [
      {
        path: ["Помощник повара", "Повар холодного цеха", "Су-шеф", "Шеф-повар"],
        weight: 0.90,
        description: "Традиционный путь через все ступени кухни"
      },
      {
        path: ["Повар-кондитер", "Су-шеф", "Шеф-повар"],
        weight: 0.80,
        description: "Путь через специализацию в кондитерском деле"
      },
      {
        path: ["Повар горячего цеха", "Бригадир смены", "Шеф-повар"],
        weight: 0.85,
        description: "Специализация на горячем цехе с управленческим опытом"
      }
    ]
  },
  optimalPath: {
    from: "Учитель",
    to: "Директор по обучению",
    paths: [
      {
        path: ["Учитель", "Методист", "Заведующий учебной частью", "Директор по обучению"],
        weight: 0.85,
        description: "Путь через методическую и административную работу"
      },
      {
        path: ["Учитель", "Корпоративный тренер", "Руководитель учебного центра", "Директор по обучению"],
        weight: 0.72,
        description: "Путь через корпоративное обучение и развитие"
      }
    ]
  },
  resumeExample: {
    text: `Опыт работы:
    2020-2023: Медсестра в поликлинике
    - Работа в процедурном кабинете
    - Ассистирование врачу
    - Ведение медицинской документации
    
    Образование:
    - Среднее медицинское образование
    - Курсы повышения квалификации`,
    steps: [
      {
        title: "Анализ текста резюме",
        result: "Медсестра (процедурный кабинет)",
        confidence: 0.95,
        description: "Извлечение ключевой информации о профессии и опыте"
      },
      {
        title: "Сопоставление с эталоном",
        result: "Процедурная медсестра",
        confidence: 0.92,
        description: "Определение стандартизированной профессии из базы"
      },
      {
        title: "Целевая позиция",
        result: "Главная медсестра",
        description: "Определение оптимальной цели карьерного развития"
      },
      {
        title: "Построение маршрута",
        paths: [
          {
            path: ["Процедурная медсестра", "Старшая медсестра отделения", "Главная медсестра"],
            weight: 0.88,
            description: "Административный путь развития"
          },
          {
            path: ["Процедурная медсестра", "Специалист по качеству медицинской помощи", "Главная медсестра"],
            weight: 0.75,
            description: "Путь через управление качеством медицинской помощи"
          }
        ]
      }
    ]
  }
};

const WeightIndicator = ({ weight }) => (
  <div className="flex flex-col space-y-1 w-full">
    <div className="flex items-center space-x-2">
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${weight * 100}%` }}
        />
      </div>
      <span className="text-sm text-primary font-medium min-w-[4rem]">
        {(weight * 100).toFixed()}%
      </span>
    </div>
    <div className="text-xs text-muted-foreground">
      Вес перехода: частота встречаемости такого карьерного пути среди успешных переходов
    </div>
  </div>
);

const PathVisualizer = ({ path, weight, description }) => (
  <div className="space-y-3 p-6 bg-card rounded-xl border hover:shadow-lg transition-all duration-300">
    <div className="flex flex-wrap items-center gap-3">
      {path.map((profession, index) => (
        <React.Fragment key={index}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="px-4 py-2 bg-accent rounded-lg text-accent-foreground whitespace-nowrap hover:bg-secondary transition-colors">
                  {profession}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Этап карьерного пути: {profession}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {index < path.length - 1 && (
            <ArrowRight className="text-muted-foreground flex-shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
    {weight && <WeightIndicator weight={weight} />}
    {description && (
      <div className="text-sm text-muted-foreground mt-2 flex items-center bg-accent/10 p-3 rounded-lg">
        <Info className="w-4 h-4 mr-2" />
        {description}
      </div>
    )}
  </div>
);

const BaseInfoDemo = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Принцип работы системы</CardTitle>
      <CardDescription>
        Основные концепции и методы построения карьерных путей
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-6 md:grid-cols-3">
        {demoData.baseInfo.sections.map((section, index) => (
          <div key={index} className="bg-accent/10 p-6 rounded-xl">
            <h3 className="font-semibold mb-4 text-primary">{section.title}</h3>
            <ul className="space-y-2">
              {section.points.map((point, pointIndex) => (
                <li key={pointIndex} className="flex items-start">
                  <span className="w-2 h-2 mt-2 bg-primary rounded-full mr-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ForwardPathDemo = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Карьерное развитие (Из А)</CardTitle>
      <CardDescription>
        Возможные пути развития из позиции: {demoData.forwardPaths.from}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {demoData.forwardPaths.paths.map((pathData, index) => (
          <PathVisualizer 
            key={index} 
            path={pathData.path} 
            weight={pathData.weight}
            description={pathData.description}
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

const BackwardPathDemo = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Карьерные истоки (В Б)</CardTitle>
      <CardDescription>
        Пути, ведущие к позиции: {demoData.backwardPaths.to}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {demoData.backwardPaths.paths.map((pathData, index) => (
          <PathVisualizer 
            key={index} 
            path={pathData.path} 
            weight={pathData.weight}
            description={pathData.description}
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

const OptimalPathDemo = () => {
  const [selectedPath, setSelectedPath] = useState(0);
  const { from, to, paths } = demoData.optimalPath;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Целевой путь (Из А в Б)</CardTitle>
        <CardDescription>
          Из: {from} → В: {to}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            {paths.map((path, index) => (
              <Button
                key={index}
                variant={selectedPath === index ? "default" : "outline"}
                onClick={() => setSelectedPath(index)}
                className="flex-1"
              >
                Маршрут {index + 1}
              </Button>
            ))}
          </div>
          <PathVisualizer 
            path={paths[selectedPath].path}
            weight={paths[selectedPath].weight}
            description={paths[selectedPath].description}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ResumeDemo = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Анализ карьеры по резюме</CardTitle>
      <CardDescription>
        Пример обработки резюме и построения карьерного пути
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-accent/10 p-6 rounded-xl">
          <h3 className="text-sm font-semibold mb-4">Входные данные:</h3>
          <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
            {demoData.resumeExample.text}
          </pre>
        </div>
        <div className="space-y-6">
          {demoData.resumeExample.steps.map((step, index) => (
            <div key={index} className="bg-card p-6 rounded-xl border">
              <h3 className="text-sm font-semibold mb-4">
                Шаг {index + 1}: {step.title}
              </h3>
              {step.result ? (
                <div className="space-y-4">
                  <div className="px-4 py-2 bg-accent/10 rounded-lg text-accent-foreground inline-block">
                    {step.result}
                  </div>
                  {step.confidence && <WeightIndicator weight={step.confidence} />}
                  {step.description && (
                    <div className="text-sm text-muted-foreground">
                      {step.description}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {step.paths.map((pathData, pathIndex) => (
                    <PathVisualizer 
                      key={pathIndex}
                      path={pathData.path}
                      weight={pathData.weight}
                      description={pathData.description}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const DemoApp = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Демонстрация сервиса карьерных маршрутов
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Интерактивная демонстрация построения карьерных путей на основе анализа реальных данных
          </p>
        </div>

        <Tabs defaultValue="base" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8">
            <TabsTrigger value="base">
              Принцип работы
            </TabsTrigger>
            <TabsTrigger value="forward">
              Карьерное развитие
            </TabsTrigger>
            <TabsTrigger value="backward">
              Карьерные истоки
            </TabsTrigger>
            <TabsTrigger value="optimal">
              Целевой путь
            </TabsTrigger>
            <TabsTrigger value="resume">
              Анализ резюме
            </TabsTrigger>
          </TabsList>

          <TabsContent value="base">
            <BaseInfoDemo />
          </TabsContent>

          <TabsContent value="forward">
            <ForwardPathDemo />
          </TabsContent>

          <TabsContent value="backward">
            <BackwardPathDemo />
          </TabsContent>

          <TabsContent value="optimal">
            <OptimalPathDemo />
          </TabsContent>

          <TabsContent value="resume">
            <ResumeDemo />
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>О системе</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="p-6 bg-card rounded-xl border">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">13.5K+</h3>
                <p className="text-muted-foreground">Профессий в базе</p>
              </div>
              <div className="p-6 bg-card rounded-xl border">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">3M+</h3>
                <p className="text-muted-foreground">Карьерных переходов</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoApp;