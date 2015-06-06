<?php namespace SomethingGoodHappenedToday\Repositories;

use Illuminate\Contracts\Cache\Repository as Cache;

class CachingUserRepository implements UserRepository {

    private $repository;

    private $cache;

    public function __construct(UserRepository $repository, Cache $cache)
    {
        $this->repository = $repository;
        $this->cache = $cache;
    }

    public function getAll()
    {
        return $this->cache->remember('users.all', 1, function() {
            return $users = $this->repository->getAll();
        });

    }

    public function show($id)
    {
        // TODO: Implement show() method.
    }
}