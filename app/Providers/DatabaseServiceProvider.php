<?php namespace SomethingGoodHappenedToday\Providers;

use Illuminate\Support\ServiceProvider;
use SomethingGoodHappenedToday\Repositories\CachingMessageRepository;
use SomethingGoodHappenedToday\Repositories\CachingUserRepository;
use SomethingGoodHappenedToday\Repositories\EloquentMessageRepository;
use SomethingGoodHappenedToday\Repositories\EloquentUserRepository;
use SomethingGoodHappenedToday\Repositories\MessageRepository;
use SomethingGoodHappenedToday\Repositories\UserRepository;


class DatabaseServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(UserRepository::class, function() {
            return new CachingUserRepository(
                new EloquentUserRepository,
                $this->app['cache.store']
            );
        });

        $this->app->singleton(MessageRepository::class, function() {
            return new CachingMessageRepository(
                new EloquentMessageRepository,
                $this->app['cache.store']
            );
        });
    }
}
